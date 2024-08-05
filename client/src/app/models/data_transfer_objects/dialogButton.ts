export default interface DialogButton {
  label: string;
  onClick(): void;
  class: string;
  shouldClose: boolean;
}
