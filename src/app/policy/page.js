import Link from "next/link";

export default function Integritetspolicy() {
  return (
    
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Integritetspolicy</h1>

      <p className="mb-4">
        Din integritet är viktig för oss. Denna policy förklarar hur vi samlar in, använder och skyddar dina personuppgifter i enlighet med GDPR (General Data Protection Regulation).
      </p>

      <h2 className="text-xl font-semibold mt-6">Vilken data samlar vi in?</h2>
      <p className="mb-4">
        Vi samlar endast in nödvändig information för att förbättra vår tjänst, såsom:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Cookies för att förbättra användarupplevelsen</li>
        <li>Beställningsinformation vid köp</li>
        <li>Kontaktuppgifter om du kontaktar oss</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Hur använder vi din data?</h2>
      <p className="mb-4">
        Vi använder din information endast för att förbättra våra tjänster och hantera beställningar. Vi säljer eller delar aldrig din data med tredje part.
      </p>

      <h2 className="text-xl font-semibold mt-6">Cookies</h2>
      <p className="mb-4">
        Vi använder cookies för att analysera trafik och förbättra din upplevelse. Du kan när som helst hantera dina cookie-inställningar via knappen <strong>"Hantera Cookies"</strong> i sidfoten.
      </p>

      <h2 className="text-xl font-semibold mt-6">Dina rättigheter</h2>
      <p className="mb-4">
        Enligt GDPR har du rätt att:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Begära ut vilken data vi har om dig</li>
        <li>Be oss radera din data</li>
        <li>Ändra eller uppdatera din data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Kontakt</h2>
      <p className="mb-4">
        Om du har frågor om vår integritetspolicy, kontakta oss på:  
        <br />
        <strong>Telefon:</strong> +4627041487  
      </p>

      <Link href="/" className="text-blue-600 hover:underline">Tillbaka till startsidan</Link>
    </div>
  );
}
