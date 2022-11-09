import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

import path from 'path';

const expect = chai.expect;

const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
const absolutePath = path.resolve(__dirname, fileToUpload);
export default class SellerProfileUpdatePage {
  pageTitle: ElementFinder = element(by.id('letslinkApp.sellerProfile.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  firstNameInput: ElementFinder = element(by.css('input#seller-profile-firstName'));
  lastNameInput: ElementFinder = element(by.css('input#seller-profile-lastName'));
  stripeAccountIdInput: ElementFinder = element(by.css('input#seller-profile-stripeAccountId'));
  artistNameInput: ElementFinder = element(by.css('input#seller-profile-artistName'));
  pictureInput: ElementFinder = element(by.css('input#seller-profile-picture'));
  descriptionInput: ElementFinder = element(by.css('input#seller-profile-description'));
  emailInput: ElementFinder = element(by.css('input#seller-profile-email'));
  phoneInput: ElementFinder = element(by.css('input#seller-profile-phone'));
  citySelect: ElementFinder = element(by.css('select#seller-profile-city'));
  countrySelect: ElementFinder = element(by.css('select#seller-profile-country'));
  userSelect: ElementFinder = element(by.css('select#seller-profile-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setFirstNameInput(firstName) {
    await this.firstNameInput.sendKeys(firstName);
  }

  async getFirstNameInput() {
    return this.firstNameInput.getAttribute('value');
  }

  async setLastNameInput(lastName) {
    await this.lastNameInput.sendKeys(lastName);
  }

  async getLastNameInput() {
    return this.lastNameInput.getAttribute('value');
  }

  async setStripeAccountIdInput(stripeAccountId) {
    await this.stripeAccountIdInput.sendKeys(stripeAccountId);
  }

  async getStripeAccountIdInput() {
    return this.stripeAccountIdInput.getAttribute('value');
  }

  async setArtistNameInput(artistName) {
    await this.artistNameInput.sendKeys(artistName);
  }

  async getArtistNameInput() {
    return this.artistNameInput.getAttribute('value');
  }

  async setPictureInput(picture) {
    await this.pictureInput.sendKeys(picture);
  }

  async getPictureInput() {
    return this.pictureInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setEmailInput(email) {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput() {
    return this.emailInput.getAttribute('value');
  }

  async setPhoneInput(phone) {
    await this.phoneInput.sendKeys(phone);
  }

  async getPhoneInput() {
    return this.phoneInput.getAttribute('value');
  }

  async setCitySelect(city) {
    await this.citySelect.sendKeys(city);
  }

  async getCitySelect() {
    return this.citySelect.element(by.css('option:checked')).getText();
  }

  async citySelectLastOption() {
    await this.citySelect.all(by.tagName('option')).last().click();
  }
  async setCountrySelect(country) {
    await this.countrySelect.sendKeys(country);
  }

  async getCountrySelect() {
    return this.countrySelect.element(by.css('option:checked')).getText();
  }

  async countrySelectLastOption() {
    await this.countrySelect.all(by.tagName('option')).last().click();
  }
  async userSelectLastOption() {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
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
    await this.setFirstNameInput('firstName');
    await waitUntilDisplayed(this.saveButton);
    await this.setLastNameInput('lastName');
    await waitUntilDisplayed(this.saveButton);
    await this.setStripeAccountIdInput('stripeAccountId');
    await waitUntilDisplayed(this.saveButton);
    await this.setArtistNameInput('artistName');
    await waitUntilDisplayed(this.saveButton);
    await this.setPictureInput(absolutePath);
    await waitUntilDisplayed(this.saveButton);
    await this.setDescriptionInput('description');
    await waitUntilDisplayed(this.saveButton);
    await this.setEmailInput('aUL^@VhNO.pF');
    await waitUntilDisplayed(this.saveButton);
    await this.setPhoneInput('phone');
    await waitUntilDisplayed(this.saveButton);
    await this.citySelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.countrySelectLastOption();
    await this.userSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
  }
}
