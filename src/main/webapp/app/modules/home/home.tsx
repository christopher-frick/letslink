import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Row, Col, Alert } from 'reactstrap';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  // @ts-ignore
  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome, to Let&apos;s Link!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p>
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
          {/*<li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.homepage">JHipster homepage</Translate>
            </a>
          </li>
          <li>
            <a href="https://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.stackoverflow">JHipster on Stack Overflow</Translate>
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.bugtracker">JHipster bug tracker</Translate>
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.chat">JHipster public chat room</Translate>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.follow">follow @jhipster on Twitter</Translate>
            </a>
          </li>*/}
        </ul>
      </Col>
    </Row>
  );
};

export default Home;
