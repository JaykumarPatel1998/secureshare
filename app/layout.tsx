
import { Header } from "@/components/customui/Header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/customui/Footer";
import { Toaster } from "@/components/ui/toaster";


export const metadata = {
  title: "Jite",
  description: "Job board for survival",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col justify-between" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >

            <Header />
            <div className="flex justify-center w-full items-center p-5">
              {children}
            </div>
            <Toaster />
            
            <Footer/>

          </ThemeProvider>
        </body>
      </html>
    </>
  )
}