import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import SellerProfileUpdatePage from './seller-profile-update.page-object';

const expect = chai.expect;
export class SellerProfileDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('letslinkApp.sellerProfile.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-sellerProfile'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class SellerProfileComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('seller-profile-heading'));
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
    await navBarPage.getEntityPage('seller-profile');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateSellerProfile() {
    await this.createButton.click();
    return new SellerProfileUpdatePage();
  }

  async deleteSellerProfile() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const sellerProfileDeleteDialog = new SellerProfileDeleteDialog();
    await waitUntilDisplayed(sellerProfileDeleteDialog.deleteModal);
    expect(await sellerProfileDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/letslinkApp.sellerProfile.delete.question/);
    await sellerProfileDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(sellerProfileDeleteDialog.deleteModal);

    expect(await isVisible(sellerProfileDeleteDialog.deleteModal)).to.be.false;
  }
}
