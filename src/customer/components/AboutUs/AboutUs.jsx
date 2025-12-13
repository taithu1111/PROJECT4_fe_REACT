import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import "../AboutUs/AboutUs";
function AboutUs() {
  return (
    <div>
      <div class="flex flex-col  w-full h-[20rem] bg-no-repeat bg-cover bg-[url('https://assets.website-files.com/63708df071bc73798fae96ee/6378b145707d74104f13ad8a_image-here%201.jpg')] bg-opacity-25">
        <main class="container mx-auto px-6 mt-20 pt-16 flex-1 text-center">
          <h2 class="font-marsf text-sm md:text-4xl lg:text-5xl text-white mb-2">
            About Us
          </h2>
        </main>
      </div>

      <div className="antialiased">
        <div className="flex w-full ml-60  p-20 ">
          <div className="w-full space-y-9">
            <span className="font-marsf text-4xl  text-[28px] ]">
              Bringing the serenity of nature into your home/workspace. We believe that plants are not just decorations, but companions that improve your life.
            </span>
            <img src="https://img.freepik.com/free-photo/beautiful-tree-middle-field-covered-with-grass-with-tree-line-background_181624-29267.jpg" />
          </div>
          <div className="w-full ml-36 mr-60 space-y-6">
            <h2 className="font-marsf text-[28px] text-[#000000]">
              What we do
            </h2>
            <div className="w-[40%] ">
              <p className="font-san text-[18px] text-[#797979]">
                We curate a diverse collection of healthy, thriving plants sourced from sustainable growers. From rare succulents to lush tropicals, we ensure every plant is ready to flourish in its new home.
              </p>
            </div>
            <div className="w-[40%] ">
              <p className="font-san text-[18px] text-[#797979]">
                More than just a shop, we are a community of plant lovers. We provide expert care guides, workshops, and ongoing support to help your green friends thrive for years to come.
              </p>
            </div>
          </div>
        </div>
        <div className="flex">
          <img
            src="https://amfissa.qodeinteractive.com/wp-content/uploads/2021/08/ip-img3.jpg"
            alt=""
            className="w-500 h-[45rem]"
          />
          <div className="w-full justify-center text-center bg-[#829067]">
            <main className="container w-[50%] ml-60 space-y-5 flex flex-col items-center justify-center px-8 mt-40 text-center">
              <h2 className="text-justify font-marsf md:text-4xl lg:text-5xl text-white mb-2">
                The secret to a happy plant is understanding its needs.
              </h2>
              <p className="text-justify font-san text-[18px] text-[#fff]">
                We take the guesswork out of plant parenthood. Our team carefully inspects every leaf and root before it reaches you, ensuring you receive only the healthiest specimens. We believe anyone can grow a green thumb with the right guidance.
              </p>
            </main>
          </div>
        </div>
        <div className="justify-center items-center bg-[#fdf9f5]">
          <div className="flex w-screen h-[35rem] bg-no-repeat bg-cover bg-opacity-25 ml-60 p-9 justify-center">
            <div class="w-[30%] space-y-6 mt-20">
              <h3 class="font-marsf text-4xl text-[34px] text-[#000000] animate-slide-in">
                “Plants have transformed my living space completely. The quality and care from this team is unmatched.”
              </h3>
              <h1 class="font-meadowbrook text-[30px] text-[#CC723F] animate-slide-in">
                Daniel K.
              </h1>
            </div>
            <div className="w-full ml-36 mr-60 space-y-4">
              <div className="w-[90%] space-y-7">
                <p className="font-san text-[18px] text-[#797979] mt-20">
                  Our journey began with a simple seed of an idea: to make nature accessible to everyone living in urban environments. We noticed how disconnected city life could feel from the natural world, and we wanted to bridge that gap. What started as a small balcony garden has grown into a passion for sharing the joy of plants with others.
                </p>
                <p className="font-san text-[18px] text-[#797979] mt-20">
                  We believe in sustainability and responsible stewardship. That's why we partner with local growers who prioritize eco-friendly practices. Every plant you purchase supports a network of dedicated horticulturists working to make our planet a little greener, one leaf at a time. Join us in growing a better future.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col min-h-screen items-center  justify-center">
          <span className="font-marsf text-[50px]">Meet Our Team</span>
          <p className="font-san text-[18px] text-[#797979]">
            Our dedicated team of plant experts is here to help you grow.
          </p>

          <div>
            <div class="grid grid-cols-1 gap-7 md:grid-cols-3 lg:grid-cols-4 mt-16">
              <div class="group relative cursor-pointer items-center justify-center overflow-hidden ">
                <div class="h-96 w-72">
                  <img
                    class="h-full w-full "
                    src="https://amfissa.qodeinteractive.com/wp-content/uploads/2021/08/team-img3.jpg"
                    alt=""
                  />
                </div>
                <div className="justify-center text-center text-gray-600 space-x-2">
                  <h5 className="font-marsf text-[24px]">Nguyễn Quang Du</h5>
                  <p className="font-san text-[18px] mb-3  text-[#797979]">
                    Plant Specialist
                  </p>
                  <FacebookRoundedIcon className="hover:text-blue-600" />
                  <InstagramIcon className="hover:text-red-500" />
                  <PinterestIcon className="hover:text-red-500" />
                </div>
              </div>

              <div class="group relative cursor-pointer items-center justify-center overflow-hidden ">
                <div class="h-96 w-72">
                  <img
                    class="h-full w-full "
                    src="https://assets.website-files.com/6371f9c50ce0bd588f4fa954/6381e32242077f4c1fa21383_image-3.jpg"
                    alt=""
                  />
                </div>
                <div className="justify-center text-center text-gray-600 space-x-2">
                  <h5 className="font-marsf text-[24px]">Phạm Bùi Bình Minh</h5>
                  <p className="font-san text-[18px] mb-3 text-[#797979]">
                    Co-Founder
                  </p>
                  <FacebookRoundedIcon className="hover:text-blue-600" />
                  <InstagramIcon className="hover:text-red-500" />
                  <PinterestIcon className="hover:text-red-500" />
                </div>
              </div>
              <div className="group relative cursor-pointer items-center justify-center overflow-hidden ">
                <div className="h-96 w-72">
                  <img
                    className="h-full w-full "
                    src="https://assets.website-files.com/6371f9c50ce0bd588f4fa954/6379b44cd600313abab50100_image.jpg"
                    alt=""
                  />
                </div>
                <div className="justify-center text-center text-gray-600 space-x-2">
                  <h5 className="font-marsf text-[24px]">Trịnh Công Nguyên</h5>
                  <p className="font-san text-[18px] mb-3 text-[#797979]">
                    Marketing Manager
                  </p>
                  <FacebookRoundedIcon className="hover:text-blue-600" />
                  <InstagramIcon className="hover:text-red-500" />
                  <PinterestIcon className="hover:text-red-500" />
                </div>
              </div>
              <div class="group relative cursor-pointer items-center justify-center overflow-hidden ">
                <div class="h-96 w-72">
                  <img
                    class="h-full w-full "
                    src="https://assets.website-files.com/6371f9c50ce0bd588f4fa954/6381e33f9f6b470f85e7e3bd_image-4.jpg"
                    alt=""
                  />
                </div>

                <div className="justify-center text-center text-gray-600 space-x-2">
                  <h5 className="font-marsf text-[24px]">Doãn Việt Quang</h5>
                  <p className="font-san text-[18px] mb-3 text-[#797979]">
                    Head Gardener
                  </p>
                  <FacebookRoundedIcon className="hover:text-blue-600" />
                  <InstagramIcon className="hover:text-red-500" />
                  <PinterestIcon className="hover:text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
