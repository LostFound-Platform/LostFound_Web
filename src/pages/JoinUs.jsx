export default function JoinUs() {
  return (
    <>
      {/* <!-- Hero Section --> */}
      <header class="text-center py-20 px-4 bg-gradient-to-b from-[#fff7ed] to-white relative overflow-hidden">
        <div class="absolute top-10 left-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute bottom-10 right-10 w-48 h-48 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

        <span class="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
          Opportunity
        </span>
        <h1 class="text-5xl font-extrabold text-gray-900 mb-6">
          Join the Team
        </h1>
        <p class="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
          Help build a platform that makes it easier for students to report,
          discover, and recover lost items on campus.
        </p>
        <button class="bg-orange-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-orange-700/20 hover:-translate-y-1 transition-transform">
          Submit Interest Form
        </button>
      </header>

      {/* <!-- About Section --> */}
      <section class="max-w-6xl mx-auto py-24 px-6 flex flex-col md:flex-row items-center gap-16">
        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-6">What is Campus Lost & Found?</h2>
          <div class="space-y-4 text-gray-600 leading-relaxed text-lg">
            <p>
              Campus Lost & Found is a student-led platform being developed to
              improve how lost and found items are reported, discovered, and
              recovered on campus.
            </p>
            <p>
              The project is currently being piloted at Gwinnett Technical
              College and is supported by student contributors across technical
              and non-technical roles.
            </p>
          </div>
        </div>
        <div class="flex-1">
          <div class="bg-white p-4 rounded-3xl shadow-xl rotate-2">
            <img
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800"
              alt="Platform Preview"
              class="rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* <!-- Why Join --> */}
      <section class="bg-gray-50 py-24">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 class="text-3xl font-bold mb-16">Why Join?</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-8 rounded-2xl text-left shadow-sm border border-gray-100 hover:shadow-md transition">
              <div class="w-10 h-10 bg-orange-50 text-orange-primary rounded-lg flex items-center justify-center mb-6">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-bold mb-2">Real-world experience</h3>
              <p class="text-gray-500 text-sm">
                Work on a platform used by real students.
              </p>
            </div>
            {/* <!-- Other benefit cards... --> */}
          </div>
        </div>
      </section>

      {/* <!-- Open Roles --> */}
      <section class="py-24 max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Open Roles</h2>
          <p class="text-gray-500 max-w-xl mx-auto">
            We value curiosity, reliability, and a willingness to learn. Prior
            experience is helpful but not required for every role.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* <!-- Role Card Example --> */}
          <div class="bg-[#fef3e9] p-8 rounded-2xl border border-orange-100 group hover:border-orange-200 transition">
            <div class="flex justify-between items-start mb-6">
              <span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                Engineering
              </span>
              <svg
                class="w-6 h-6 text-orange-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Frontend Contributor</h3>
            <p class="text-gray-600 text-sm mb-6">
              React, UI improvements, Accessibility
            </p>
            <a
              href="#"
              class="text-orange-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              Apply Now <span>&rarr;</span>
            </a>
          </div>
          {/* <!-- Additional Roles... --> */}
        </div>
      </section>

      {/* <!-- Contributor Path --> */}
      <section class="bg-[#fff7ed] py-24">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 class="text-3xl font-bold mb-16">Contributor Path</h2>
          <div class="flex justify-between items-center relative">
            <div class="absolute h-0.5 bg-orange-200 w-full top-1/2 -translate-y-1/2 z-0"></div>
            {/* <!-- Step 1 --> */}
            <div class="relative z-10 bg-[#fff7ed] px-4">
              <div class="w-12 h-12 bg-white text-orange-primary rounded-xl shadow-md flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
              <span class="text-xs font-bold uppercase tracking-widest">
                Interest Form
              </span>
            </div>
            {/* <!-- Additional steps... --> */}
          </div>
        </div>
      </section>
    </>
  );
}
