type QuestionLayoutProps = {
  children: React.ReactNode;
};

const QuestionLayout = ({ children }: QuestionLayoutProps) => {
  return <div className="flex flex-col w-full">{children}</div>;
};

export default QuestionLayout;
