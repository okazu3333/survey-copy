import { redirect } from "next/navigation";

const ReviewPage = () => {
  redirect("/surveys/review/reviewer/preview");
};

export default ReviewPage;
