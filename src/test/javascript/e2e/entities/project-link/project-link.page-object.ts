import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import ProjectLinkUpdatePage from './project-link-update.page-object';

const expect = chai.expect;
export class ProjectLinkDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('letslinkApp.projectLink.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-projectLink'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class ProjectLinkComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('project-link-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('project-link');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateProjectLink() {
    await this.createButton.click();
    return new ProjectLinkUpdatePage();
  }

  async deleteProjectLink() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const projectLinkDeleteDialog = new ProjectLinkDeleteDialog();
    await waitUntilDisplayed(projectLinkDeleteDialog.deleteModal);
    expect(await projectLinkDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/letslinkApp.projectLink.delete.question/);
    await projectLinkDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(projectLinkDeleteDialog.deleteModal);

    expect(await isVisible(projectLinkDeleteDialog.deleteModal)).to.be.false;
  }
}
