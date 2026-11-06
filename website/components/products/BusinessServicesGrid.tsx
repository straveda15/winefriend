import { Boxes, Gift, Hotel, Paintbrush, UtensilsCrossed, Wine } from "lucide-react";

const businessServices = [
  {
    title: "Wineries and wine producers",
    description:
      "Wine and champagne corks, glassware, decanters, preservation systems and promotional materials are part of our range. Wine-related products can be customised to client specifications.",
    Icon: Wine,
  },
  {
    title: "Hotels and restaurants",
    description:
      "Explore wine glasses, decanters, corkscrews and preservation systems from our wine accessories range for hotel and restaurant settings.",
    Icon: UtensilsCrossed,
  },
  {
    title: "Hospitality businesses",
    description:
      "Wine-related products for hospitality and service businesses, including glassware, decanters, openers and preservation systems.",
    Icon: Hotel,
  },
  {
    title: "Corporate gifting",
    description:
      "Wine accessories and promotional materials for gifting enquiries, with product customisation discussed against your requirements.",
    Icon: Gift,
  },
  {
    title: "Customised products",
    description:
      "Products are manufactured or imported and can be customised to client specifications and current market trends.",
    Icon: Paintbrush,
  },
  {
    title: "Bulk supply enquiries",
    description:
      "Discuss bulk supply for your business. Share the products, quantities and specifications you have in mind through our enquiry form.",
    Icon: Boxes,
  },
];

export function BusinessServicesGrid() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {businessServices.map(({ title, description, Icon }, index) => (
        <article
          key={title}
          className={`flex h-full min-h-[12rem] flex-col border border-gold/25 p-5 shadow-[0_8px_24px_rgba(50,42,27,0.04)] hover:border-gold/55 hover:shadow-[0_16px_32px_rgba(50,42,27,0.09)] sm:min-h-[12.5rem] sm:p-6 ${index === 0 || index === businessServices.length - 1 ? "bg-gradient-to-br from-[#fffdf8] via-[#faf5e9] to-[#f3ead8]" : "bg-white"}`}
        >
          <div className="flex min-h-11 items-center gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-gold/35 bg-[#F8F3E8] text-gold">
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <h3 className="font-serif text-lg font-medium leading-snug text-charcoal sm:text-xl">
              {title}
            </h3>
          </div>
          <p className="mt-2 font-sans text-sm leading-6 text-charcoal-light">
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}
