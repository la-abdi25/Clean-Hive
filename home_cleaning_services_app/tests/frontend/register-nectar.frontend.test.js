import { render, screen, fireEvent } from "@testing-library/react";
import RegisterNectar from "../../src/app/register-nectar/page";
import userEvent from "@testing-library/user-event";

//register nectar page testing
describe("register-nectar page", () => {
  describe("Register Nectar view", () => {
    it("should have Already have an account? text", () => {
      render(<RegisterNectar />);
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    });
    it("should have a button with text Register ", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByRole("button", { name: "Register" })
      ).toBeInTheDocument();
    });
    it("should have a button with text Login ", () => {
      render(<RegisterNectar />);
      expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    });
    it("should have input field with label First Name", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    });
    it("should have input field with label Last Name", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
    });
    it("should have input field with label Email", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    });
    it("should have input field with label Phone Number", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    });
    it("should have input field with label Billing Address", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Billing Address/)).toBeInTheDocument();
    });
    it("should have input field with label Bio", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Bio/)).toBeInTheDocument();
    });
    it("should have input field with label cleaning plan", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Cleaning plan/)).toBeInTheDocument();
    });
    it("should have input field with label upload profile image", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Upload Profile Image/)).toBeInTheDocument();
    });
    it("should have legend with label Billing", () => {
      render(<RegisterNectar />);
      expect(screen.getByText("Billing")).toBeInTheDocument();
    });
    it("should have availability times description", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByText("Please Enter Five Availability Times:")
      ).toBeInTheDocument();
    });
    it("should have input field with label City", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/City/)).toBeInTheDocument();
    });
    it("should have input field with label Password", () => {
      render(<RegisterNectar />);
      expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    });
    it("should have input field with label Time 1", () => {
      render(<RegisterNectar />);
      expect(screen.getByText(/Time 1/)).toBeInTheDocument();
    });
    it("should have input field with label Time 2", () => {
      render(<RegisterNectar />);
      expect(screen.getByText(/Time 2/)).toBeInTheDocument();
    });
    it("should have input field with label Time 3", () => {
      render(<RegisterNectar />);
      expect(screen.getByText(/Time 3/)).toBeInTheDocument();
    });
    it("should have input field with label Time 4", () => {
      render(<RegisterNectar />);
      expect(screen.getByText(/Time 4/)).toBeInTheDocument();
    });
    it("should have input field with label Time 5", () => {
      render(<RegisterNectar />);
      expect(screen.getByText(/Time 5/)).toBeInTheDocument();
    });
    it("should have input field with label Date", () => {
      render(<RegisterNectar />);
      const dateInputs = screen.getAllByLabelText("Date");
      expect(dateInputs).toHaveLength(5);
    });
    it("should have input field with label Time", () => {
      render(<RegisterNectar />);
      const timeInputs = screen.getAllByLabelText("Time");
      expect(timeInputs).toHaveLength(5);
    });
    it("should have input field with label Time Frame", () => {
      render(<RegisterNectar />);
      const timeInputs = screen.getAllByLabelText("Time Frame");
      expect(timeInputs).toHaveLength(5);
    });
    it("should have input field with placeholder text for first name", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter first name here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for last name", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter last name here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for email", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter email here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for phone number", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter phone number here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for password", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter password here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for city", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter city here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for bio", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Enter cleaning background here.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for billing address", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(
          /Please enter street address, city, state, zipcode format.../
        )
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for cleaning plan", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByText(/-- Please choose a plan --/)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for choosing am/pm", () => {
      render(<RegisterNectar />);
      const timeFrameInputs = screen.getAllByText("--Choose AM/PM--");
      expect(timeFrameInputs).toHaveLength(5);
    });
    it("should have input field with placeholder text for time 1", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Please enter your first date.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for time 2", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Please enter your second date.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for time 3", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Please enter your third date.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for time 4", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Please enter your fourth date.../)
      ).toBeInTheDocument();
    });
    it("should have input field with placeholder text for time 5", () => {
      render(<RegisterNectar />);
      expect(
        screen.getByPlaceholderText(/Please enter your fifth date.../)
      ).toBeInTheDocument();
    });
  });
  describe("Register Nectar errors", () => {
    it("register click no first name entered", async () => {
      render(<RegisterNectar />);
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
      render(<RegisterNectar />);
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
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Email/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(screen.getByText(/Please enter your email./)).toBeInTheDocument();
    });
    it("register click no phone number entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Phone Number/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter a valid phone number./)
      ).toBeInTheDocument();
    });
    it("register click no billing address entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Billing Address/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your address./)
      ).toBeInTheDocument();
    });
    it("register click no bio entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Bio/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(screen.getByText(/Please enter your bio./)).toBeInTheDocument();
    });
    it("register click no cleaning plan entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Cleaning plan/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your preferred cleaning plan./)
      ).toBeInTheDocument();
    });
    it("register click no profile image entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/Upload Profile Image/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(
        screen.getByText(/Please enter your profile image./)
      ).toBeInTheDocument();
    });
    it("register click no city entered", async () => {
      render(<RegisterNectar />);
      fireEvent.change(screen.getByLabelText(/City/), {
        target: { value: "" },
      });
      const showRegister = screen.getByRole("button", { name: "Register" });
      await userEvent.click(showRegister);
      expect(screen.getByText(/Please enter your city./)).toBeInTheDocument();
    });
    it("register click no password entered", async () => {
      render(<RegisterNectar />);
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
