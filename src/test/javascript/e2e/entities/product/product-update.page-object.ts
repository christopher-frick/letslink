import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

import path from 'path';

const expect = chai.expect;

const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
const absolutePath = path.resolve(__dirname, fileToUpload);
export default class ProductUpdatePage {
  pageTitle: ElementFinder = element(by.id('letslinkApp.product.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#product-name'));
  descriptionInput: ElementFinder = element(by.css('input#product-description'));
  pictureInput: ElementFinder = element(by.css('input#product-picture'));
  productCategorySelect: ElementFinder = element(by.css('select#product-productCategory'));
  priceInput: ElementFinder = element(by.css('input#product-price'));
  fileInput: ElementFinder = element(by.css('input#product-file'));
  sellerProfileSelect: ElementFinder = element(by.css('select#product-sellerProfile'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setPictureInput(picture) {
    await this.pictureInput.sendKeys(picture);
  }

  async getPictureInput() {
    return this.pictureInput.getAttribute('value');
  }

  async setProductCategorySelect(productCategory) {
    await this.productCategorySelect.sendKeys(productCategory);
  }

  async getProductCategorySelect() {
    return this.productCategorySelect.element(by.css('option:checked')).getText();
  }

  async productCategorySelectLastOption() {
    await this.productCategorySelect.all(by.tagName('option')).last().click();
  }
  async setPriceInput(price) {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput() {
    return this.priceInput.getAttribute('value');
  }

  async setFileInput(file) {
    await this.fileInput.sendKeys(file);
  }

  async getFileInput() {
    return this.fileInput.getAttribute('value');
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
    await this.setDescriptionInput('description');
    await waitUntilDisplayed(this.saveButton);
    await this.setPictureInput(absolutePath);
    await waitUntilDisplayed(this.saveButton);
    await this.productCategorySelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setPriceInput('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setFileInput(absolutePath);
    await this.sellerProfileSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
  }
}
