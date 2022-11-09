import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Row, Col, Alert, Button } from 'reactstrap';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <Row>
      <h1>Let&apos;s Link</h1>
      {account?.login ? (
        <div>
          <Alert color="success">
            <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
              You are logged in as user {account.login}.
            </Translate>
          </Alert>
        </div>
      ) : (
        <div>
          <Alert color="warning">
            <Translate contentKey="global.messages.info.authenticated.prefix">If you already have an account, you can </Translate>
            <Link to="/login" className="alert-link">
              <Translate contentKey="global.messages.info.authenticated.link">sign in here</Translate>
            </Link>
            <Translate contentKey="global.messages.info.authenticated.suffix">
              <br /> This site is currently under development as part of a study.
              <br /> Would you like more information or want to give us feedback? Send us an e-mail to{' '}
              <a href="mailto:christopher.frick@outlook.fr">christopher.frick@outlook.fr.</a>
            </Translate>
          </Alert>

          {/*<Alert color="warning">
                <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
                <Link to="/account/register" className="alert-link">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>*/}
        </div>
      )}
      <h2>
        <Translate contentKey="home.title">Welcome, to Let&apos;s Link!</Translate>
      </h2>
      <p className="lead">
        <Translate contentKey="home.subtitle">
          Let&apos;s link with more people and fans across the world. Update your profile with a link in your bio that automatically
          displays your information&apos;s like your projects, social media, merch and more.
        </Translate>
      </p>
      {!account?.login && (
        <Button tag={Link} to="/login" color="primary" size="lg" className="mr-3">
          <Translate contentKey="global.menu.account.login">Sign in</Translate>
        </Button>
      )}
      <br />
      <Button tag={Link} to="/seller-profile/" color="secondary" size="lg" className="mr-3">
        Start Browsing
      </Button>
      <p>
        <Translate contentKey="home.question">Here are some links related to the Let&apos;s Link project:</Translate>
      </p>

      <ul>
        <li>
          <a
            href="https://www.figma.com/proto/IIZ08eEOfwdbmU7O9pVfuC/Music-Marketplace?page-id=0%3A1&node-id=4%3A22&starting-point-node-id=4%3A22"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate contentKey="home.link.prototype">Figma clickable prototype</Translate>
          </a>
        </li>
      </ul>
    </Row>
  );
};

export default Home;
