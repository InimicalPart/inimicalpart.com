import TimeForInimi from "@/components/main/time";
import { chooseArticle } from "@/utils/misc";
import dayjs from "dayjs";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs(1163622720000), "year", true).toString().split(".")[0]

  return {
    title: "Contact Inimi",
    description: "Information about contacting Inimi",
    openGraph: {
      title: "Inimi",
      description: `The official website of Inimi, ${chooseArticle(years)} ${years}-year-old full-stack developer.`,
      type: 'website',
      url: 'https://inimicalpart.com',
    },
    twitter: {
      card: "summary",
      images: [
        {
          url: 'https://inimicalpart.com/logo.png',
          width: 64,
          height: 64,
          alt: 'Inimi\'s logo',
        }
      ],      
    }
  }
}

export default async function Contact() {
  return (
    <>
      <div className="text-center -mt-4 flex flex-col">
        <h1 className="text-2xl font-bold">Contact</h1>
        <br/>
        <p className="text-md mt-4">
          You can reach me via email at <b><a href="mailto:me@inimicalpart.com">me@inimicalpart.com</a></b> or through Discord at <b><i>@theinimi</i></b>.
        </p>
        <div className="text-md mt-4 flex flex-row self-center">
        It is currently <b>{<TimeForInimi/>}</b> for me.
        </div>
      </div>
    </>
  );
}