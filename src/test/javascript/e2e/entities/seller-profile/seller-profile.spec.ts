import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SellerProfileComponentsPage from './seller-profile.page-object';
import SellerProfileUpdatePage from './seller-profile-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('SellerProfile e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let sellerProfileComponentsPage: SellerProfileComponentsPage;
  let sellerProfileUpdatePage: SellerProfileUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    sellerProfileComponentsPage = new SellerProfileComponentsPage();
    sellerProfileComponentsPage = await sellerProfileComponentsPage.goToPage(navBarPage);
  });

  it('should load SellerProfiles', async () => {
    expect(await sellerProfileComponentsPage.title.getText()).to.match(/Seller Profiles/);
    expect(await sellerProfileComponentsPage.createButton.isEnabled()).to.be.true;
  });

  /* it('should create and delete SellerProfiles', async () => {
        const beforeRecordsCount = await isVisible(sellerProfileComponentsPage.noRecords) ? 0 : await getRecordsCount(sellerProfileComponentsPage.table);
        sellerProfileUpdatePage = await sellerProfileComponentsPage.goToCreateSellerProfile();
        await sellerProfileUpdatePage.enterData();
        expect(await isVisible(sellerProfileUpdatePage.saveButton)).to.be.false;

        expect(await sellerProfileComponentsPage.createButton.isEnabled()).to.be.true;
        await waitUntilDisplayed(sellerProfileComponentsPage.table);
        await waitUntilCount(sellerProfileComponentsPage.records, beforeRecordsCount + 1);
        expect(await sellerProfileComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

        await sellerProfileComponentsPage.deleteSellerProfile();
        if(beforeRecordsCount !== 0) {
          await waitUntilCount(sellerProfileComponentsPage.records, beforeRecordsCount);
          expect(await sellerProfileComponentsPage.records.count()).to.eq(beforeRecordsCount);
        } else {
          await waitUntilDisplayed(sellerProfileComponentsPage.noRecords);
        }
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
