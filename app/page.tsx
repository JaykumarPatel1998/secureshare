import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default async function Index() {

  return (

    <div className="w-full lg:flex gap-4 justify-center">

      <Card className="bg-card border-none self-center">
        <CardHeader>
          <CardTitle>Secure Share</CardTitle>
          <CardDescription>A safe and secure way to store and share files over the cloud. We also provide semantic search for your stored documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={"default"}>
            <Link href={"/uploadFiles"}>Get Started</Link>
          </Button>
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
      </div>
    </div>
  )
}