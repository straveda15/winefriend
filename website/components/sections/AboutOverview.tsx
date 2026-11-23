import { Container } from "@/components/layout/Container";

const overviewParagraphs = [
  "\u201cWINE FRIEND\u201d is a registered Trade Mark of the renowned company KAMALTARA ENTERPRISES based in Nashik in the state of Maharashtra situated around 180 kilometers from Mumbai in India. Kamaltara Enterprises is owned and operated for the past two decades by Mr. Manoj Jagtap, \u201cThe Wine Friend\u201d who is born and raised in the Nashik Valley, a veteran of the Indian Wine Industry. Kamaltara Enterprises is engaged in the business of import of a wide range of Wine bottle Corks from \u201dAmorim Corks S. A. in Portugal, PVC Shrink sleeves & polylaminate capsules, Muselets/wirehoods for champagne bottles, Champagne Capsules from Italy, Wine Openers from China and also engaged in manufacturing of Wooden, Acrylic, Stainless Steel or Wrought Iron Wine stands / Wine Racks and other wine-related promotional materials.",
  "We also supply Wine Glasses, Wine Openers, Wine Preservation Systems, Decanters, etc. The products offered by us are acknowledged for their intricate designs, excellent finish, and elegant appearance. Leveraging on a competent workforce, we are able to manufacture the products according to the market trends and clients' specifications. Our quality controllers keep an eye on the production process and make sure that quality is maintained at all the stages of production. We ensure that finished products are free from all defects and are in accordance with international quality standards. Moreover, we accept payment via UPI, Cash, Demand Drafts, or Bank Transfers for the convenience of our clients. In addition to this, we are also engaged in organising Vineyard trails,  Winery Visits and Wine Tours in the Nashik Valley, we are the most known name as a wine tour operator in the Nashik Valley. We are also a member of the \u201cAll India Wine Producers Association (AIWPA)\u201d, Travel Agents Association of Nashik (TAAN) and Enterprising Travel Agents Association (ETAA) we keep up to date with trends to ensure our guests enjoy the best possible experience on their winery tours of Nashik Valley or wineries accross India.",
];

export function AboutOverview() {
  return (
    <section className="wf-section wf-about-overview" aria-labelledby="wf-about-overview-title">
      <Container className="wf-about-overview-content">
        <p className="wf-about-overview-eyebrow">Welcome to</p>
        <h2 id="wf-about-overview-title" className="wf-about-overview-title">WINE FRIEND</h2>
        <div className="wf-about-overview-copy">
          {overviewParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </Container>
    </section>
  );
}
