// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-6xl font-bold mb-6">
//           Find Your Dream Career 🚀
//         </h1>
//         <p className="text-xl mb-8">
//           Connecting Talent With Top Companies
//         </p>
//         <a
//           href="/jobs"
//           className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
//         >
//           Browse Jobs
//         </a>
//       </div>
//     </div>
//   );
// }

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        Find Your Dream Career 🚀
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Connecting Talent With Top Companies
      </p>

      <a
        href="/jobs"
        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        Browse Jobs
      </a>
    </div>
  );
}