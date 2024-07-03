import Image from "next/image";
import heroImage from "@/public/svg.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default async function Index() {

  return (

    <div className="w-full lg:flex gap-4 justify-center">

      {/* <Card className="bg-card border-none self-center">
        <CardHeader>
          <CardTitle>Secure Share</CardTitle>
          <CardDescription>A safe and secure way to store and share files over the cloud. We also provide semantic search for your stored documents.</CardDescription>
        </CardHeader>
        <CardContent>
            <Link href={"/files"}><Button variant={"default"}>Start uploading</Button></Link>
        </CardContent>
      </Card>


      <div className="hidden lg:block self-center">
        <Image
          src="/svg.png"
          alt="Image"
          width="400"
          height="350"
          className="object-cover"
        />
      </div> */}

<div className="w-full h-full relative">
              <div className="flex flex-col-reverse lg:flex-row gap-10 mt-16">
                {/* hero text */}
                <section className="w-full lg:w-[50%] flex flex-col p-5 md:p-10">
                  <div className="w-full flex justify-start flex-col h-auto lg:pt-7">
                    <h1 className="text-3xl dark:text-white mt-5 md:text-4xl lg:text-6xl xl:text-7xl text-black font-extrabold">
                      <span className="text-blue-500">SecureShare</span>,<br />
                      Secure File Storage & Sharing Solutions
                    </h1>
                  </div>
                  <div className="flex flex-col space-y-2 pt-4">
                    <span className="font-medium dark:text-white text-gray-600">
                      Having security concerns with your files?
                    </span>
                    <span className="font-medium dark:text-white text-gray-600">
                      Let us help you
                    </span>
                    <Link href={"/files"}><Button variant={"default"}>Start uploading</Button></Link>
                  </div>
                </section>
                {/* hero image */}
                <section className="relative w-full lg:w-[50%] flex items-center justify-center lg:justify-end">
                  <Image src={heroImage} alt="Hero" className="object-contain z-10" />
                </section>
              </div>
            </div>
    </div>
  )
}