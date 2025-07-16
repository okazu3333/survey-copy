import { NewsListSection } from "../_components/news-list-section";

const NewsListPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-6 py-8">
        <NewsListSection />
      </main>
    </div>
  );
};

export default NewsListPage; 