export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VAULT Technologies",
    description: "Secure messaging platform for government and enterprise",
    url: "https://b2g-vault.vercel.app",
    logo: "https://b2g-vault.vercel.app/favicon.svg",
    sameAs: [
      "https://github.com/webspoilt/vault",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      email: "hello@vault-demo.dev",
      availableLanguage: ["English"],
    },
  };

  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VAULT",
    description: "Secure messaging platform designed for government agencies and enterprises",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, Linux, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "End-to-end encryption",
      "Compliance-first architecture",
      "Sovereign deployment",
      "Audit logging",
      "Role-based access control",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VAULT",
    url: "https://b2g-vault.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://b2g-vault.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}