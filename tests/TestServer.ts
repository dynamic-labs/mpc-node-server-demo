import { Server as HttpServer, createServer } from 'http';
import jestOpenAPI from 'jest-openapi';
import supertest from 'supertest';

import path from 'path';
import { Application } from 'express';
import TestAgent from 'supertest/lib/agent';
import app from '../src/index';

afterAll(() => {
  testServer.close();
});

beforeAll(() => {
  testServer.init();
  jestOpenAPI(path.join(__dirname, '../src/generated/openapi/api@v1.yaml'));
});

beforeEach(() => {
  jest.clearAllMocks();
});

export class TestServer {
  private testApp: Application;

  private testServer?: HttpServer;

  public constructor() {
    this.testApp = app;
  }

  public get app(): TestAgent {
    if (!this.testServer) {
      throw new Error('Server not initialized');
    }

    return supertest(this.testServer);
  }

  public init(): void {
    this.testServer = createServer(this.testApp);
  }

  public close(): void {
    this.testServer?.close();
  }
}

export const testServer = new TestServer();
