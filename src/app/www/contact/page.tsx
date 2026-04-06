import TimeForInimi from "@/components/main/time";
import { chooseArticle } from "@/utils/misc";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs.utc(1163623320000), "year", true).toString().split(".")[0]

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
          alt: "Inimi's logo",
        }
      ],      
    }
  }
}

export default async function Contact() {
  return (
    <>
      <div className="text-center -mt-2 flex flex-col max-w-xl mx-auto">
        {/* editorial header */}
        <div className="flex flex-col items-center mb-10">
          <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
            get in touch
          </span>
          <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
            contact <em className="italic text-neutral-500 dark:text-neutral-400">me</em>
          </h1>
        </div>

        <div className="bg-neutral-100/80 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl px-10 py-8 border border-neutral-200/60 dark:border-neutral-700/40">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-1 font-medium">
                email
              </span>
              <a href="mailto:contact@inimicalpart.com"
                 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                contact@inimicalpart.com
              </a>
            </div>

            <div className="w-full h-px bg-neutral-200/60 dark:bg-neutral-700/40" />

            <div className="flex flex-col items-center">
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-1 font-medium">
                discord
              </span>
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                @theinimi
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-200/60 dark:bg-neutral-700/40 mt-8" />

          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-6 text-center">
            It is currently <b className="text-neutral-700 dark:text-neutral-300">{<TimeForInimi/>}</b> for me.
          </div>
        </div>
      </div>
    </>
  );
}
