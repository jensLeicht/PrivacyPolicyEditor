export class Step {
    name: string = "";
    description: string = ""
    component: any;
    label: string = "";
    filled!: boolean;
    ready!: boolean;
    req!: boolean;
    icon: string = "";
  }