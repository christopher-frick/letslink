import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ProjectLinkComponentsPage from './project-link.page-object';
import ProjectLinkUpdatePage from './project-link-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('ProjectLink e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let projectLinkComponentsPage: ProjectLinkComponentsPage;
  let projectLinkUpdatePage: ProjectLinkUpdatePage;
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
    projectLinkComponentsPage = new ProjectLinkComponentsPage();
    projectLinkComponentsPage = await projectLinkComponentsPage.goToPage(navBarPage);
  });

  it('should load ProjectLinks', async () => {
    expect(await projectLinkComponentsPage.title.getText()).to.match(/Project Links/);
    expect(await projectLinkComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete ProjectLinks', async () => {
    const beforeRecordsCount = (await isVisible(projectLinkComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(projectLinkComponentsPage.table);
    projectLinkUpdatePage = await projectLinkComponentsPage.goToCreateProjectLink();
    await projectLinkUpdatePage.enterData();
    expect(await isVisible(projectLinkUpdatePage.saveButton)).to.be.false;

    expect(await projectLinkComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(projectLinkComponentsPage.table);
    await waitUntilCount(projectLinkComponentsPage.records, beforeRecordsCount + 1);
    expect(await projectLinkComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await projectLinkComponentsPage.deleteProjectLink();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(projectLinkComponentsPage.records, beforeRecordsCount);
      expect(await projectLinkComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(projectLinkComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
