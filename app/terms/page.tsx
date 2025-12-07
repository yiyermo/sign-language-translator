import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Términos de Uso</h1>
        <p className="text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Aceptación de los Términos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Bienvenido a Yiyermo Sign Language Translator. Al acceder y utilizar esta plataforma, aceptas estar vinculado por estos Términos de Uso, todas las leyes y regulaciones aplicables, y aceptas ser responsable del cumplimiento de todas las leyes locales aplicables.
          </p>
          <p>
            Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas comerciales aplicables.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Descripción del Servicio</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Yiyermo Sign Language Translator es una plataforma que proporciona servicios de traducción entre lenguaje de señas y texto, incluyendo:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Traducción de texto a lenguaje de señas mediante visualización de señas</li>
            <li>Traducción de lenguaje de señas a texto mediante reconocimiento visual</li>
            <li>Deletreo dactilológico interactivo</li>
            <li>Historial de traducciones personalizadas</li>
            <li>Herramientas de aprendizaje y práctica</li>
          </ul>
          <p className="mt-3">
            Nos reservamos el derecho de modificar, suspender o descontinuar cualquier aspecto del servicio en cualquier momento sin previo aviso.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Registro y Cuenta de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">3.1 Creación de Cuenta</h3>
            <p className="text-muted-foreground">
              Para utilizar ciertas funciones del servicio, debes crear una cuenta. Al registrarte, te comprometes a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Proporcionar información precisa, actual y completa</li>
              <li>Mantener actualizada tu información de registro</li>
              <li>Mantener la seguridad de tu contraseña</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
              <li>Ser responsable de todas las actividades que ocurran bajo tu cuenta</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3.2 Elegibilidad</h3>
            <p className="text-muted-foreground">
              Debes tener al menos 13 años de edad para usar este servicio. Si tienes entre 13 y 18 años, debes tener el permiso de un padre o tutor legal.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3.3 Seguridad de la Cuenta</h3>
            <p className="text-muted-foreground">
              Eres responsable de mantener la confidencialidad de tu contraseña. No compartiremos tu contraseña ni te pediremos que la reveles en comunicaciones no solicitadas.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Uso Aceptable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">4.1 Conducta Permitida</h3>
            <p className="text-muted-foreground">
              Puedes usar nuestro servicio para fines legales y de acuerdo con estos términos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Aprendizaje y práctica de lenguaje de señas</li>
              <li>Comunicación accesible</li>
              <li>Educación e investigación académica</li>
              <li>Uso personal no comercial</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4.2 Conducta Prohibida</h3>
            <p className="text-muted-foreground">
              Al usar nuestro servicio, aceptas NO:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Violar cualquier ley o regulación aplicable</li>
              <li>Infringir los derechos de propiedad intelectual de otros</li>
              <li>Transmitir contenido ofensivo, difamatorio o ilegal</li>
              <li>Utilizar el servicio para acosar, amenazar o intimidar a otros</li>
              <li>Intentar obtener acceso no autorizado a otros sistemas</li>
              <li>Interferir con el funcionamiento del servicio</li>
              <li>Utilizar bots, scrapers o herramientas automatizadas no autorizadas</li>
              <li>Copiar, modificar o distribuir el contenido del servicio sin permiso</li>
              <li>Vender, revender o explotar comercialmente el servicio</li>
              <li>Hacerse pasar por otra persona o entidad</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Propiedad Intelectual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">5.1 Nuestros Derechos</h3>
            <p className="text-muted-foreground">
              Todo el contenido del servicio, incluyendo texto, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales, compilaciones de datos y software, es propiedad de Yiyermo Sign Language Translator o de sus proveedores de contenido y está protegido por leyes de derechos de autor.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5.2 Tu Contenido</h3>
            <p className="text-muted-foreground">
              Retienes todos los derechos sobre el contenido que crees o traduzcas. Al usar nuestro servicio, nos otorgas una licencia limitada, no exclusiva, libre de regalías para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Almacenar tu contenido para proporcionarte el servicio</li>
              <li>Usar datos agregados y anónimos para mejorar el servicio</li>
              <li>Generar estadísticas de uso sin identificarte personalmente</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5.3 Licencia de Uso</h3>
            <p className="text-muted-foreground">
              Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para usar el servicio para fines personales y no comerciales de acuerdo con estos términos.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Privacidad y Protección de Datos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Tu privacidad es importante para nosotros. El uso de información personal se rige por nuestra{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Política de Privacidad
            </Link>
            , que forma parte de estos Términos de Uso.
          </p>
          <p>
            Al usar nuestro servicio, consientes la recopilación y uso de información de acuerdo con nuestra Política de Privacidad.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Limitación de Responsabilidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">7.1 Precisión del Servicio</h3>
            <p className="text-muted-foreground">
              Aunque nos esforzamos por proporcionar traducciones precisas, el servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos que:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Las traducciones sean 100% precisas o completas</li>
              <li>El servicio esté disponible de forma ininterrumpida o sin errores</li>
              <li>Los defectos serán corregidos inmediatamente</li>
              <li>El servicio sea compatible con todo el hardware y software</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">7.2 Exclusión de Garantías</h3>
            <p className="text-muted-foreground">
              En la medida máxima permitida por la ley, renunciamos a todas las garantías, expresas o implícitas, incluyendo garantías de comerciabilidad, idoneidad para un propósito particular y no infracción.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">7.3 Limitación de Daños</h3>
            <p className="text-muted-foreground">
              En ningún caso seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas intangibles.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Indemnización</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Aceptas defender, indemnizar y mantener indemne a Yiyermo Sign Language Translator, sus afiliados, licenciantes y proveedores de servicios, y sus respectivos directores, empleados, contratistas, agentes, licenciantes, proveedores, sucesores y cesionarios de y contra cualquier reclamo, responsabilidad, daños, juicios, premios, pérdidas, costos, gastos o tarifas (incluyendo honorarios razonables de abogados) que resulten de o estén relacionados con tu violación de estos Términos de Uso o tu uso del servicio.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Terminación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Podemos terminar o suspender tu cuenta y acceso al servicio inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo sin limitación si incumples estos Términos de Uso.
          </p>
          <p>
            También puedes terminar tu cuenta en cualquier momento contactándonos o eliminando tu cuenta desde la configuración de tu perfil.
          </p>
          <p>
            Al terminar tu cuenta:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Tu derecho a usar el servicio cesará inmediatamente</li>
            <li>Podemos eliminar tu información personal después de 30 días</li>
            <li>Ciertas disposiciones de estos términos sobrevivirán a la terminación</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Modificaciones del Servicio y Términos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Nos reservamos el derecho de modificar o reemplazar estos términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia.
          </p>
          <p>
            Lo que constituye un cambio material se determinará a nuestra sola discreción. Al continuar accediendo o usando nuestro servicio después de que las revisiones entren en vigencia, aceptas estar vinculado por los términos revisados.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>11. Ley Aplicable y Jurisdicción</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Nuestra falta de ejercicio de cualquier derecho o disposición de estos términos no constituirá una renuncia a ese derecho o disposición.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>12. Resolución de Disputas</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Si tienes alguna disputa con nosotros, primero intenta resolverla informalmente contactándonos. Si no podemos resolver la disputa informalmente, cualquier disputa legal que surja de o relacionada con estos términos se resolverá mediante arbitraje vinculante.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>13. Divisibilidad</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Si alguna disposición de estos términos se considera inválida o inaplicable, esa disposición se limitará o eliminará en la medida mínima necesaria, y las disposiciones restantes de estos términos continuarán en pleno vigor y efecto.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>14. Acuerdo Completo</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Estos Términos de Uso, junto con nuestra Política de Privacidad, constituyen el acuerdo completo entre tú y Yiyermo Sign Language Translator con respecto al uso del servicio, y reemplazan todos los acuerdos anteriores o contemporáneos entre tú y nosotros.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>15. Contacto</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-3">
            Si tienes preguntas sobre estos Términos de Uso, puedes contactarnos:
          </p>
          <ul className="space-y-2">
            <li><strong>Email:</strong> legal@yiyermo.com</li>
            <li><strong>Email de soporte:</strong> support@yiyermo.com</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          Al utilizar Yiyermo Sign Language Translator, reconoces que has leído, entendido y aceptas estar vinculado por estos Términos de Uso.
        </p>
        <p>
          Consulta también nuestra{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}