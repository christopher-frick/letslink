import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class ProjectLinkUpdatePage {
  pageTitle: ElementFinder = element(by.id('letslinkApp.projectLink.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#project-link-name'));
  urlInput: ElementFinder = element(by.css('input#project-link-url'));
  sellerProfileSelect: ElementFinder = element(by.css('select#project-link-sellerProfile'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setUrlInput(url) {
    await this.urlInput.sendKeys(url);
  }

  async getUrlInput() {
    return this.urlInput.getAttribute('value');
  }

  async sellerProfileSelectLastOption() {
    await this.sellerProfileSelect.all(by.tagName('option')).last().click();
  }

  async sellerProfileSelectOption(option) {
    await this.sellerProfileSelect.sendKeys(option);
  }

  getSellerProfileSelect() {
    return this.sellerProfileSelect;
  }

  async getSellerProfileSelectedOption() {
    return this.sellerProfileSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setNameInput('name');
    await waitUntilDisplayed(this.saveButton);
    await this.setUrlInput('url');
    await this.sellerProfileSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
  }
}
