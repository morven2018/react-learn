declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
