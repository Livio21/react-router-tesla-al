import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { client } from "../sanity/client"; 

type GeneralInfo = {
  title: string;
  content: string;
  image?: { asset: { url: string } };
};

export default function InfoPage() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<GeneralInfo | null>(null);

  const identifier =
    searchParams.get("brand") ||
    searchParams.get("model") ||
    searchParams.get("name");

  useEffect(() => {
    if (!type || !identifier) return;

    const fetchData = async () => {
      const query = `*[_type == "generalInfo" && type == $type && identifier == $identifier][0]{
        title, content, image{asset->{url}}
      }`;
      const result = await client.fetch(query, { type, identifier });
      setData(result);
    };

    fetchData();
  }, [type, identifier]);

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      {data.image?.asset.url && (
        <img
          src={data.image.asset.url}
          alt={data.title}
          className="w-full rounded-lg mb-6"
        />
      )}
      <p className="text-lg leading-relaxed whitespace-pre-wrap">
        {data.content}
      </p>
    </div>
  );
}
