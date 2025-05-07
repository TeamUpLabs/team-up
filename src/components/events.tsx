import eventsData from '../../public/json/events.json';

interface event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
}

export default function Events() {
    const events: event[] = eventsData.slice(0, 2);

    return (
        <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl text-text-primary-color md:text-4xl font-bold mb-5 tracking-tight">다가오는 이벤트</h2>
              <p className="text-text-secondary-color mb-10 max-w-xl leading-relaxed">온라인과 오프라인에서 개최되는 다양한 개발자 이벤트에 참여하세요</p>
              
              <div className="space-y-6">
                {events.map((event, idx) => (
                    <div key={idx} className={`bg-component-background border p-6 rounded-lg border-l-4 backdrop-blur-sm hover:translate-x-1 transition-transform ${idx % 2 === 0 ? 'border-point-color-green' : 'border-point-color-purple'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <span className="text-xs text-text-primary-color bg-component-background px-2 py-1 rounded">
                                {
                                    (() => {
                                        const currentYear = new Date().getFullYear();
                                        const dateParts = event.date.split(' ');
                                        const eventYear = parseInt(dateParts[0].replace('년', ''));
                                        
                                        if (eventYear === currentYear) {
                                            return dateParts.slice(1).join(' ');
                                        } else {
                                            return event.date;
                                        }
                                    })()
                                }
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary-color mb-3 leading-relaxed">{event.description}</p>
                        <div className={`flex items-center text-xs ${idx % 2 === 0 ? 'text-point-color-green' : 'text-point-color-purple'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                        </div>
                    </div>

                ))
                }
              </div>
              
              <button className="mt-10 bg-transparent text-text-primary-color border border-component-border px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center group cursor-pointer">
                모든 이벤트 보기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    )
}