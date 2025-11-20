import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../src/app/login/page";
import userEvent from "@testing-library/user-event";
//login page testing
describe("Login Page", () => {
  describe("Login view", () => {
    it("should have Don't have an account? text", () => {
      render(<Login />);
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
    it("should have a button with text Login ", () => {
      render(<Login />);
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });
    it("should have a button with text Bees for registration", () => {
      render(<Login />);
      expect(screen.getByRole("link", { name: "Bees" })).toBeInTheDocument();
    });
    it("should have a button with text Nectars for registration", () => {
      render(<Login />);
      expect(screen.getByRole("link", { name: "Nectars" })).toBeInTheDocument();
    });
    it("should have input field with label Email", () => {
      render(<Login />);
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    });
    it("should have input field with label Password", () => {
      render(<Login />);
      expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    });
    it("should have input field with label Role", () => {
      render(<Login />);
      expect(screen.getByLabelText(/Role/)).toBeInTheDocument();
    });
    it("should have input field with placeholder text for email", () => {
      render(<Login />);
      expect(
        screen.getByPlaceholderText(/Enter email here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for password", () => {
      render(<Login />);
      expect(
        screen.getByPlaceholderText(/Enter password here.../)
      ).toBeInTheDocument();
    });
    it("test select options choose role", () => {
      render(<Login />);
      expect(
        screen.getByText(/--Please choose your role--/)
      ).toBeInTheDocument();
    });
    it("test select options choose role bee", () => {
      render(<Login />);
      expect(screen.getByText("Bee")).toBeInTheDocument();
    });
    it("test select options choose role nectar", () => {
      render(<Login />);
      expect(screen.getByText("Nectar")).toBeInTheDocument();
    });
  });
  describe("Login errors", () => {
    it("Login click no email entered", async () => {
      render(<Login />);
      fireEvent.change(screen.getByLabelText(/Email/), {
        target: { value: "" },
      });
      const showLogin = screen.getByRole("button", { name: "Login" });
      await userEvent.click(showLogin);
      expect(screen.getByText(/Please enter your email./)).toBeInTheDocument();
    });
    it("Login click no password entered", async () => {
      render(<Login />);
      fireEvent.change(screen.getByLabelText(/Password/), {
        target: { value: "" },
      });
      const showLogin = screen.getByRole("button", { name: "Login" });
      await userEvent.click(showLogin);
      expect(
        screen.getByText(/Please enter your password./)
      ).toBeInTheDocument();
    });
    it("Login click no role entered", async () => {
      render(<Login />);
      fireEvent.change(screen.getByLabelText(/Role/), {
        target: { value: "" },
      });
      const showLogin = screen.getByRole("button", { name: "Login" });
      await userEvent.click(showLogin);
      expect(screen.getByText(/Please enter your role./)).toBeInTheDocument();
    });
  });
  describe("Login selection", () => {
    it("select bee as a option", async () => {
      render(<Login />);
      const select = screen.getByLabelText(/Role/);
      await userEvent.selectOptions(select, "Bee");
      expect(select.value).toBe("bee");
    });
    it("select nectar as a option", async () => {
      render(<Login />);
      const select = screen.getByLabelText(/Role/);
      await userEvent.selectOptions(select, "Nectar");
      expect(select.value).toBe("nectar");
    });
  });
});
