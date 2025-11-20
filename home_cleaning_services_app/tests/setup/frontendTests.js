import "@testing-library/jest-dom";
import { TextEncoder } from "util";
import React from "react";
//bypass error of ReferenceError: TextEncoder is not defined
global.React = React;
global.TextEncoder = global.TextEncoder || TextEncoder;
//mock useRouter in all tests that use it
const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useParams: () => ({}),
  useRouter: () => ({
    push: mockRouter,
  }),
}));

global.myRouter = { mockRouter };
