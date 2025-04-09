interface TitleSecctionProps {
  text: string;
}

export const TitleSecction = ({ text }: TitleSecctionProps) => {
  return <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{text}</h1>;
};
