import "@testing-library/jest-dom";

jest.mock("next/image", () => {
  function MockedNextImage({
    unoptimized,
    alt,
    ...rest
  }: {
    unoptimized?: boolean;
    alt?: string;
  } & React.ImgHTMLAttributes<HTMLImageElement>) {
    void unoptimized;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt || "image"} {...rest} />;
  }

  return MockedNextImage;
});

jest.mock("next/link", () => {
  function MockedNextLink({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return MockedNextLink;
});
