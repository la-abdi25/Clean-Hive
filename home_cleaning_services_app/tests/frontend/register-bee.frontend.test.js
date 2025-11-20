import { render, screen, fireEvent } from "@testing-library/react";
import RegisterBee from "../../src/app/register-bee/page.js";
import userEvent from "@testing-library/user-event";
//register bee page testing
describe("register-bee page", () => {
  describe("Register Bee view", () => {
    it("should have Already have an account? text", () => {
      render(<RegisterBee />);
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    });
    it("should have a button with text Register ", () => {
      render(<RegisterBee />);
      expect(
        screen.getByRole("button", { name: "Register" })
      ).toBeInTheDocument();
    });
    it("should have a button with text Login ", () => {
      render(<RegisterBee />);
      expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    });
    it("should have input field with label First Name", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    });
    it("should have input field with label Last Name", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    });
    it("should have input field with label Email", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    });
    it("should have input field with label Phone Number", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    });
    it("should have input field with label Password", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    });
    it("should have input field with label Home Address", () => {
      render(<RegisterBee />);
      expect(screen.getByLabelText(/Home Address/)).toBeInTheDocument();
    });
    it("should have legend with label Location", () => {
      render(<RegisterBee />);
      expect(screen.getByText(/Location/)).toBeInTheDocument();
    });
    it("should have input field with placeholder text for first name", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(/Enter first name here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for last name", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(/Enter last name here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for email", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(/Enter email here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for phone number", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(/Enter phone number here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for password", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(/Enter password here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for home address", () => {
      render(<RegisterBee />);
      expect(
        screen.getByPlaceholderText(
          /Please enter street address, city, state, zipcode format.../
        )
      ).toBeInTheDocument();
    });
  });
  describe("Register Bee errors", () => {
    it("register click no first name entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/First Name/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your first name./)
      ).toBeInTheDocument();
    });
    it("register click no last name entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/Last Name/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your last name./)
      ).toBeInTheDocument();
    });
    it("register click no email entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/Email/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(screen.getByText(/Please enter your email./)).toBeInTheDocument();
    });
    it("register click no phone number entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/Phone Number/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter a valid phone number./)
      ).toBeInTheDocument();
    });
    it("register click no home address entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/Home Address/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your address./)
      ).toBeInTheDocument();
    });
    it("register click no password entered", async () => {
      render(<RegisterBee />);
      fireEvent.change(screen.getByLabelText(/Password/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your password./)
      ).toBeInTheDocument();
    });
  });
});
