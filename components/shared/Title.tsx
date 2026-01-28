import React from "react";
interface Props {
  title: string;
  subtitle: string;
}
const Title = (props: Props) => {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold text-slate-800">{props.title}</h1>
      <p className="text-slate-500">{props.subtitle}</p>
    </div>
  );
};

export default Title;
