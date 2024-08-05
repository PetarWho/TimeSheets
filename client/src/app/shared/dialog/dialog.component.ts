import { Component, Input, TemplateRef } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { Inject } from "@angular/core";

@Component({
  selector: "app-dialog",
  styleUrls: ["dialog.component.css"],
  templateUrl: "dialog.component.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
})
export class DialogComponent {
  @Input() buttonConfigs: {
    label: string;
    onClick: () => void;
    shouldClose: boolean;
  }[] = [];
  @Input() height: string = "250px";
  @Input() width: string = "250px";
  @Input() enterAnimationDuration: string = "200ms";
  @Input() exitAnimationDuration: string = "100ms";
  @Input() contentTemplate!: TemplateRef<string>;
  @Input() dialogTitle: string = "Dialog";
  @Input() buttonText: string = "Open modal form";
  @Input() showButton: boolean = true;

  private dialogRef!: MatDialogRef<DialogOverlayComponent>;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogOverlayComponent, {
      height: this.height,
      width: this.width,
      enterAnimationDuration: this.enterAnimationDuration,
      exitAnimationDuration: this.exitAnimationDuration,
      data: {
        buttons: this.buttonConfigs,
        contentTemplate: this.contentTemplate,
        dialogTitle: this.dialogTitle,
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-dialog-overlay",
  templateUrl: "dialog-overlay.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
})
export class DialogOverlayComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  handleButtonClick(button: { onClick: Function; shouldClose: boolean }) {
    button.onClick();
    if (button.shouldClose) {
      this.dialogRef.close();
    }
  }
}
