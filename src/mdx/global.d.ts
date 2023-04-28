declare module "*.mdx" {
  let MDXComponent: (props: string) => string;
  export default MDXComponent;
}
