import { chooseArticle } from "@/utils/misc"
import dayjs from "dayjs"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const years = dayjs().diff(dayjs(1163622720000), "year", true).toString().split(".")[0]

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
          alt: 'Inimi\'s logo',
        }
      ],      
    }
  }
}

export default async function About() {
  return <>
    <div className="text-center -mt-4 flex flex-col">
    <h1 className="text-2xl font-bold">About Inimi</h1>
    <p className="text-md"><i>The Backstory</i></p>
    <br/>
    <p className="text-md mt-4 text-left">
      At a young age of 10, Inimi started his journey in the world of programming.
      <br/>
      <br/>
      <br/>
      Inimi was interested in creating Discord bots, as the idea of creating his own bot to his specifications was fascinating to him. He started searching on YouTube for tutorials on how to create a Discord bot. He wished that creating one was gonna be a piece of cake, but he was wrong. All of the tutorials featured some sort of coding language that he had never heard of before. Inimi thought that programming looked difficult, so he decided to keep on searching for an easier method.
      <br/>
      <br/>
      After desperate amounts of searching with no avail, Inimi decided to take a shot at following one of the tutorials. He picked a tutorial that used C# as the programming language, and started following it. As he followed along with the tutorial, Inimi kept on getting confused when unexpected warnings and errors kept popping up.
      <br/>
      <br/>
      After being unable to follow the tutorial due to the errors, Inimi, with his determination at an all-time high, decided to take a stab at another tutorial. This time, the tutorial used JavaScript as the programming language. Inimi was able to follow along with the tutorial with ease, and was quite enjoying the process of creating his first Discord bot, quickly grasping the basics of JavaScript.
      <br/>
      <br/>
      After long hours of coding, Inimi finally completed his first Discord bot, which was a simple bot that could do different things such as rolling a dice, responding to the user, and more. Inimi was really happy with his creation, and decided that he wanted to keep working on it to make it even better.
      <br/>
      <br/>
      Inimi started looking at other tutorials, documentations and source codes of Discord bots made in JavaScript in pursuit to learn more about JavaScript and how he could improve his bot, and after a few weeks, Inimi had a bot that was able to do a lot more than just roll a dice.
      <br/>
      <br/>
      Inimi was proud of his creation, and later-on decided he wanted to try making one for his close friend. After listening to his friend&apos;s requests, Inimi immediately started working on the bot, and after a few days, he had a bot that was customly designed for his friend&apos;s requests.
      <br/>
      <br/>
      During his research for more things to add to his bot, Inimi stumbled upon a website called &quot;GitHub&quot;. Inimi was fascinated by the idea of being able to share his code with others, and decided to create an account on the website.
      <br/>
      <br/>
      After uploading both of his bots to GitHub, Inimi started looking at what JavaScript was capable of, and started learning more about the language. Inimi was amazed by the amount of things that could be done with JavaScript, and decided to keep on learning more about the language.
      <br/>
      <br/>
      In no time, Inimi&apos;s head started flooding with ideas for new projects, and he started working on them right away. The idea of creating something completely new and unique was fascinating to him, and he was determined to make his ideas a reality.
      <br/>
      <br/>
      As time went on, Inimi started exploring other programming and markup languages such as PHP, HTML, CSS, Java, and C#, and started working on projects in those languages as well. The more languages Inimi learned, the faster it took him to grasp the basics of a new language. He started collaborating with other developers on projects, and started learning more about the world of programming.
      <br/>
      <br/>
      Inimi&apos;s passion for programming only grew stronger as time went on, and he started working on bigger projects that required more time and effort. Inimi was determined to make his projects the best they could be, and he was willing to put in the time and effort required to make them a reality.
      <br/>
      <br/>
      Until we come to the present day, Inimi is now a full-stack developer with a passion for creating software that is both unique and innovative. Inimi is always looking for new challenges to overcome, and is always looking for new things to learn.


    </p>

    </div>

    </>
}