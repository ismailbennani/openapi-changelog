export function diff(args: DiffArgs) {
  console.log("DIFF");
  console.log(args);
}

export interface DiffArgs {
  old_openapi_spec: string;
  new_openapi_spec: string;
}
