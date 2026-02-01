export default function StructuredData() {
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VAULT Technologies",
        description: "Secure messaging platform for government and enterprise",
        url: "https://vault.in",
        logo: "https://vault.in/favicon.svg",
        sameAs: [
            "https://github.com/webspoilt/vault",
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "Embassy Tech Village, Block B, Outer Ring Road",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            postalCode: "560103",
            addressCountry: "IN"
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Sales",
            telephone: "+91-80-4567-8900",
            email: "sales@vault.in",
            availableLanguage: ["English", "Hindi"],
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
            priceCurrency: "INR",
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
        url: "https://vault.in",
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
