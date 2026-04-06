import { chooseArticle } from "@/utils/misc"
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs.utc(1163623320000), "year", true).toString().split(".")[0]

  return {
    title: "About Inimi",
    description: "The Backstory of Inimi",
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

export default async function About() {
  return <>
    <div className="text-center -mt-2 flex flex-col max-w-2xl mx-auto">

      {/* editorial header */}
      <div className="flex flex-col items-center mb-10">
        <span className="text-[0.55rem] uppercase tracking-[0.5em] text-neutral-400 dark:text-neutral-500 mb-4 font-medium">
          about
        </span>
        <h1 className="font-serif text-3xl md:text-[2.8rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
          the <em className="italic text-neutral-500 dark:text-neutral-400">backstory</em>
        </h1>
      </div>

      <div className="space-y-5 text-left text-neutral-700 dark:text-neutral-300 leading-relaxed">

        <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg pb-2 border-b border-neutral-200/60 dark:border-neutral-700/60">
          At the young age of 10, Inimi started his journey in the world of programming.
        </p>

        <p>
          Inimi was interested in creating Discord bots, as he was always curious how Discord bots worked and how hard it was to make one. The idea of creating his own bot to his specifications was also fascinating to him. He searched YouTube for tutorials on how to create a Discord bot. He wished that creating one would be a piece of cake, but he was wrong. All the tutorials featured coding, which he had never heard of before. Inimi thought programming looked difficult, so he decided to keep searching for an easier method.
        </p>

        <p>
          After extensive searching with no success, Inimi decided to take a shot at following one of the tutorials. He picked a tutorial that used C# and started following it. As he followed along, Inimi kept getting confused by unexpected warnings and errors that were not present in the tutorial.
        </p>

        <p>
          Unable to follow the tutorial due to the errors, Inimi, with his determination at an all-time high, decided to try another tutorial. This time, the tutorial used JavaScript. Inimi was able to follow along with ease and enjoyed the process of creating his first Discord bot, quickly grasping the basics of JavaScript.
        </p>

        <p>
          After long hours of coding, Inimi finally completed his first Discord bot, which could perform tasks such as rolling a dice, responding to users, and more. Inimi was very happy with his creation and decided that he wanted to keep working on it to make it even better.
        </p>

        <p>
          Inimi started looking at other tutorials, documentation, and source codes of other Discord bots made in JavaScript to learn more about the language and improve his bot. After a few weeks, Inimi had a bot that could do much more than just roll a dice.
        </p>

        <p>
          Inimi was proud of his creation and later decided to try to make one for one of his close friends. After listening to his friend&apos;s requests, Inimi immediately started working on the bot, and after a few days, he had a bot that was custom-designed for all of his friend&apos;s needs.
        </p>

        <p>
          During his research for more things to add to his bot, Inimi stumbled upon a website called GitHub. He was fascinated by the idea of sharing his code with others and decided to create an account.
        </p>

        <p>
          After proudly uploading both of his bots to GitHub, Inimi started looking at what JavaScript was capable of, and started learning more about the language. He was amazed by the amount of things that could be done with JavaScript and decided to keep learning.
        </p>

        <p>
          In no time, Inimi&apos;s head was flooding with ideas for new projects, and he started working on them right away. The idea of creating something completely new and unique fascinated him, and he was determined to make his ideas a reality.
        </p>

        <p>
          As time went on, Inimi started exploring other programming and markup languages such as PHP, HTML, CSS, Java, and C#. The more languages he learned, the faster he grasped the basics of each new language. He started collaborating with other developers on projects and learning more about the world of programming.
        </p>

        <p>
          Inimi&apos;s passion for programming grew stronger over time, leading him to work on bigger projects that required more time and effort. He was determined to make his projects the best they could be and was willing to put in the necessary time and effort.
        </p>

        <div className="pt-3 pb-4 border-b border-neutral-200/60 dark:border-neutral-700/60">
          <p className="text-neutral-500 dark:text-neutral-400 italic">
            Until we come to the present day, Inimi is now a full-stack developer with a passion for creating software that is both unique and innovative. He is always looking for new challenges to overcome and new things to learn.
          </p>
        </div>
      </div>

    </div>
  </>
}
