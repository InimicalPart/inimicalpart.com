import TimeForInimi from "@/components/main/time";
import { chooseArticle } from "@/utils/misc";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs.utc(1163545200000), "year", true).toString().split(".")[0]

  return {
    title: "Contact Inimi",
    description: "Information about contacting Inimi",
    openGraph: {
      title: "Inimi",
      description: `The official website of Inimi, ${chooseArticle(years)} ${years}-year-old full-stack developer.`,
      type: 'website',
      url: 'https://inimi.dev',
    },
    twitter: {
      card: "summary",
      images: [
        {
          url: 'https://inimi.dev/logo.png',
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
      <div className="mx-auto flex max-w-3xl flex-col rounded-3xl border border-black/10 bg-white/60 px-6 py-8 text-center shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/35 sm:px-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Let&apos;s build something great</p>

        <p className="mt-6 text-base leading-8 text-neutral-800 dark:text-neutral-200">
          You can reach me via email at <b><a className="underline decoration-sky-400/60 underline-offset-4" href="mailto:contact@inimicalpart.com">contact@inimicalpart.com</a></b> or through Discord at <b><i>@inimi</i></b>.
        </p>
        <div className="mt-4 flex flex-row items-center justify-center text-base text-neutral-700 dark:text-neutral-300">
          It is currently <TimeForInimi/> for me.
        </div>
      </div>
    </>
  );
}
