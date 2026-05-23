import { useEffect, useMemo, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const quickActions = ['Find a plumber near me', 'Track my booking', 'Cancel a booking', 'What services do you offer?'];

const localAnswer = (text, context) => {
  const query = text.toLowerCase();
  if (query.includes('cancel')) {
    const booking = context.bookings.find((item) => query.includes(item.bookingId.toLowerCase())) || context.bookings[0];
    if (!booking) return 'I do not see any bookings yet. Once you book a service, you can cancel confirmed bookings from Dashboard > Upcoming.';
    const refund = (Date.now() - booking.bookedAt) / 60000 <= 30;
    return `I found ${booking.bookingId}. It is ${booking.status}. ${refund ? `You are eligible for a full refund of Rs ${booking.totalAmount} if you cancel now.` : 'This booking is outside the 30-minute full-refund window.'} Open Dashboard and tap Cancel on the booking card.`;
  }
  if (query.includes('booking') || query.includes('track')) {
    const upcoming = context.bookings.filter((item) => item.status === 'Confirmed').slice(0, 2);
    if (!upcoming.length) return 'You do not have upcoming confirmed bookings right now. You can book from the Services page in your selected city.';
    return upcoming.map((item) => `${item.bookingId}: ${item.service} with ${item.providerName} on ${item.date}, ${item.timeSlot}.`).join(' ');
  }
  const service = context.services.find((item) => query.includes(item.toLowerCase())) || (query.includes('leaking') ? 'AC repair' : '');
  if (service) {
    const maxPrice = Number(query.match(/under\s*rs?\s*(\d+)|under\s*₹\s*(\d+)/)?.[1] || query.match(/under\s*rs?\s*(\d+)|under\s*₹\s*(\d+)/)?.[2] || 800);
    const matches = context.providers.filter((provider) => provider.services.includes(service) && provider.pricePerHour <= maxPrice).slice(0, 3);
    if (!matches.length) return `I could not find ${service} providers under Rs ${maxPrice} in ${context.city}. Try raising the price filter.`;
    return `In ${context.city}, top ${service} options are: ${matches.map((provider) => `${provider.providerName} (${provider.rating}, Rs ${provider.pricePerHour}/hr, ${provider.experience} yrs)`).join('; ')}.`;
  }
  if (query.includes('refund')) return 'Full refund is available within 30 minutes of booking. Refunds are marked in the dashboard and reflect in 5-7 business days.';
  if (query.includes('payment')) return 'We accept UPI apps like GPay, PhonePe and Paytm, credit/debit cards, net banking and wallets through the mock Razorpay flow.';
  return `We offer plumbers, electricians, carpenters, painters, cleaners, pest control, AC repair, appliance repair and more across Indian cities. In ${context.city}, I can help you find providers by budget, rating or locality.`;
};

const AIAssistant = () => {
  const { currentUser, bookings, providers, selectedCity } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi, I am OneStroke Assistant. How can I help today?' }]);
  const cityProviders = useMemo(() => providers.filter((provider) => provider.city === selectedCity), [providers, selectedCity]);

  useEffect(() => {
    const openAssistant = () => setOpen(true);
    window.addEventListener('osp-open-assistant', openAssistant);
    return () => window.removeEventListener('osp-open-assistant', openAssistant);
  }, []);

  const send = async (text = input) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    const context = {
      user: currentUser,
      city: selectedCity,
      bookings: bookings.slice(0, 5),
      providers: cityProviders,
      services: Array.from(new Set(providers.flatMap((provider) => provider.services))),
    };
    const AGENT_SYSTEM_PROMPT = `You are the OneStroke Pro AI assistant. You help users book home services across Indian cities. Current context: ${JSON.stringify(context)}. Always respond warmly, concisely, in Indian context, under 80 words unless listing providers.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: AGENT_SYSTEM_PROMPT,
          messages: nextMessages.filter((item) => item.role !== 'assistant' || item.content !== messages[0].content),
        }),
      });
      const data = await response.json();
      const content = data?.content?.[0]?.text || localAnswer(text, context);
      setMessages((items) => [...items, { role: 'assistant', content }]);
    } catch {
      setMessages((items) => [...items, { role: 'assistant', content: localAnswer(text, context) }]);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-purple-700 text-white shadow-lg flex items-center justify-center" title="OneStroke Assistant">
        <Bot />
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-[90] w-[calc(100vw-2.5rem)] max-w-[380px] h-[520px] bg-white rounded-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
            <div><p className="font-bold">OneStroke Assistant</p><p className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-1" /> Online</p></div>
            <button onClick={() => setOpen(false)}><X /></button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-purple-700 text-white ml-auto' : 'bg-primary-ivory text-charcoal'}`}>
                {message.content}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {quickActions.map((item) => <button key={item} onClick={() => send(item)} className="text-xs border rounded-full px-3 py-1">{item}</button>)}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded-md px-3 py-2 text-sm" placeholder="Ask about bookings or services..." />
            <button className="bg-purple-700 text-white rounded-md px-3"><Send size={18} /></button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
