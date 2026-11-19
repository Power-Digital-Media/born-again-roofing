interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

// Restricted FAQPage JSON-LD intentionally omitted on commercial sites per Google Search guidelines;
// visible FAQ accordions and Q&A blocks remain rendered in semantic HTML for users and AI engines.
export default function FAQSchema(_props: FAQSchemaProps) {
  void _props;
  return null;
}
