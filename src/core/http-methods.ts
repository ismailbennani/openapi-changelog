export const HttpMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;
export type HttpMethod = (typeof HttpMethods)[number];

export function isHttpMethod(value: string): value is HttpMethod {
  const methods: readonly string[] = HttpMethods;
  return methods.includes(value);
}
