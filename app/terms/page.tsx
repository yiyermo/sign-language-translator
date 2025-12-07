import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="Manos que Hablan Logo"
            className="h-14 w-auto hover:opacity-90 transition"
          />
        </Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Términos de Uso de Manos que Hablan</h1>
        <p className="text-muted-foreground">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Estos Términos de Uso regulan el acceso y utilización de la plataforma Manos que
          Hablan y su traductor de Lengua de Señas Chilena. Al usar el sitio, declaras haber
          leído, entendido y aceptado estos términos.
        </p>
      </div>

      {/* 1. ACEPTACIÓN */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Aceptación de los Términos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Al acceder o utilizar Manos que Hablan, ya sea como usuario registrado o como
            visitante, aceptas cumplir estos Términos de Uso y nuestra{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2">
              Política de Privacidad
            </Link>
            .
          </p>
          <p>
            Si no estás de acuerdo con alguno de estos términos, te recomendamos no utilizar
            la plataforma.
          </p>
        </CardContent>
      </Card>

      {/* 2. NATURALEZA DEL SERVICIO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Naturaleza del servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Manos que Hablan es un proyecto académico de desarrollo de software orientado a la
            accesibilidad comunicacional, que ofrece un traductor de Lengua de Señas Chilena
            (LSCh) en formato web.
          </p>
          <p>
            El servicio se proporciona con fines educativos y de apoyo general. No constituye,
            ni pretende constituir, una herramienta oficial de interpretación profesional,
            asesoría jurídica, educativa, médica ni de ninguna otra naturaleza especializada.
          </p>
          <p>
            El uso que realices de las traducciones o resultados es de tu exclusiva
            responsabilidad.
          </p>
        </CardContent>
      </Card>

      {/* 3. CREACIÓN Y USO DE CUENTAS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Cuentas de usuario y credenciales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Para acceder a ciertas funcionalidades (como el historial de traducciones), puedes
            crear una cuenta en Manos que Hablan.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Debes proporcionar información veraz y actualizada al registrarte (por ejemplo,
              tu nombre y correo electrónico).
            </li>
            <li>
              Eres responsable de mantener la confidencialidad de tu contraseña y de todas las
              actividades realizadas bajo tu cuenta.
            </li>
            <li>
              Debes notificarnos de inmediato si detectas un uso no autorizado de tu cuenta o
              cualquier incidente de seguridad.
            </li>
          </ul>
          <p className="text-sm">
            Manos que Hablan se reserva el derecho de suspender o cancelar cuentas que se
            utilicen de manera contraria a estos términos o que comprometan la seguridad de la
            plataforma o de otros usuarios.
          </p>
        </CardContent>
      </Card>

      {/* 4. USO ADECUADO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Uso permitido y responsabilidades del usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Te comprometes a utilizar Manos que Hablan de manera responsable y respetuosa.</p>
          <p>No está permitido, entre otros:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Utilizar la plataforma para fines ilegales o contrarios a la normativa vigente.
            </li>
            <li>
              Ingresar, compartir o traducir contenido que sea discriminatorio, violento, de
              odio, abusivo, difamatorio, obsceno o que vulnere derechos de terceros.
            </li>
            <li>
              Intentar acceder sin autorización a sistemas, datos o cuentas de otros usuarios.
            </li>
            <li>
              Introducir código malicioso, virus, bots u otros elementos que puedan afectar el
              funcionamiento del sitio.
            </li>
            <li>
              Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de
              la plataforma, salvo que la legislación aplicable lo permita expresamente.
            </li>
          </ul>
          <p className="text-sm">
            Eres responsable del contenido que ingresas al sistema y del uso que das a los
            resultados de las traducciones.
          </p>
        </CardContent>
      </Card>

      {/* 5. CONTENIDO Y PROPIEDAD INTELECTUAL */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Propiedad intelectual y contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            El diseño, interfaz, logotipos, nombre del proyecto, código, textos explicativos y
            demás elementos de Manos que Hablan son propiedad del equipo desarrollador del
            proyecto y/o de sus colaboradores, o se utilizan bajo las licencias correspondientes.
          </p>
          <p>
            Se te concede una licencia limitada, no exclusiva, personal e intransferible para
            utilizar la plataforma únicamente con fines personales, educativos o de prueba,
            conforme a estos Términos de Uso.
          </p>
          <p>
            No se te otorga ningún derecho de titularidad sobre el software ni sobre los
            contenidos de la plataforma, más allá de lo necesario para su uso normal.
          </p>
        </CardContent>
      </Card>

      {/* 6. DISPONIBILIDAD DEL SERVICIO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Disponibilidad, modificaciones y mantenimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Manos que Hablan se ofrece “tal cual” y “según disponibilidad”. Al tratarse de un
            proyecto académico, no garantizamos:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Disponibilidad ininterrumpida del servicio.</li>
            <li>Ausencia total de errores o fallos técnicos.</li>
            <li>Que el servicio satisfaga todas tus expectativas específicas.</li>
          </ul>
          <p>
            Podremos actualizar, modificar o interrumpir temporal o definitivamente el servicio,
            en todo o en parte, en cualquier momento y sin necesidad de aviso previo, en
            particular para realizar mantenimiento, mejoras o cambios académicos/técnicos.
          </p>
        </CardContent>
      </Card>

      {/* 7. LIMITACIÓN DE RESPONSABILIDAD */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Limitación de responsabilidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            En la medida máxima permitida por la legislación aplicable, Manos que Hablan y las
            personas involucradas en su desarrollo no serán responsables por:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Daños directos o indirectos derivados del uso o imposibilidad de uso de la
              plataforma.
            </li>
            <li>
              Decisiones o acciones que tomes basadas en los resultados de las traducciones.
            </li>
            <li>
              Pérdida de información, interrupciones del servicio, errores o fallos técnicos.
            </li>
          </ul>
          <p className="text-sm">
            Al usar Manos que Hablan reconoces que se trata de una herramienta experimental y
            académica, y que su uso es bajo tu propio riesgo.
          </p>
        </CardContent>
      </Card>

      {/* 8. ENLACES A TERCEROS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Enlaces a otros sitios web</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            La plataforma puede incluir enlaces a sitios web de terceros (por ejemplo, recursos
            educativos o documentación técnica). Manos que Hablan no controla ni es responsable
            del contenido, políticas o prácticas de dichos sitios externos.
          </p>
          <p>
            Te recomendamos revisar las políticas de privacidad y términos de uso de cualquier
            sitio de terceros que visites.
          </p>
        </CardContent>
      </Card>

      {/* 9. TERMINACIÓN */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Suspensión y cancelación de cuentas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Manos que Hablan se reserva el derecho de suspender o cancelar tu cuenta y/o acceso
            a la plataforma si:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Infringes estos Términos de Uso o la Política de Privacidad.</li>
            <li>Realizas actividades que pongan en riesgo la seguridad del sistema o de otros usuarios.</li>
            <li>
              Utilizas la plataforma con fines ilícitos, abusivos o que vulneren derechos de
              terceros.
            </li>
          </ul>
          <p className="text-sm">
            También puedes solicitar en cualquier momento la eliminación de tu cuenta siguiendo
            las opciones disponibles en la plataforma o escribiendo a{" "}
            <strong>privacidad@manosquehablan.app</strong>.
          </p>
        </CardContent>
      </Card>

      {/* 10. PROTECCIÓN DE DATOS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Protección de datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            El tratamiento de tus datos personales se regula por nuestra{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2">
              Política de Privacidad
            </Link>
            , la cual forma parte integrante de estos Términos de Uso.
          </p>
          <p>
            Al aceptar estos términos, declaras que también has leído y aceptado la Política de
            Privacidad de Manos que Hablan.
          </p>
        </CardContent>
      </Card>

      {/* 11. MODIFICACIONES A LOS TÉRMINOS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>11. Modificaciones de estos Términos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Manos que Hablan podrá modificar estos Términos de Uso para reflejar cambios en el
            servicio, ajustes académicos o actualizaciones legales.
          </p>
          <p>
            Las nuevas versiones de los términos se publicarán en esta página, actualizando la
            fecha de &quot;Última actualización&quot;. El uso continuado del servicio después
            de la publicación de los cambios implicará la aceptación de los nuevos términos.
          </p>
        </CardContent>
      </Card>

      {/* 12. LEY APLICABLE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>12. Ley aplicable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            En la medida en que la normativa aplicable lo permita, estos Términos de Uso se
            interpretarán de acuerdo con las leyes vigentes en Chile, sin perjuicio de las
            normas de protección de consumidores o de protección de datos que resulten
            imperativas en tu país de residencia.
          </p>
        </CardContent>
      </Card>

      {/* 13. CONTACTO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>13. Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            Si tienes preguntas, comentarios o sugerencias sobre estos Términos de Uso, puedes
            escribirnos a:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Email privacidad:</strong>{" "}
              <a
                href="mailto:privacidad@manosquehablan.app"
                className="text-primary underline underline-offset-2"
              >
                privacidad@manosquehablan.app
              </a>
            </li>
            <li>
              <strong>Email soporte general:</strong>{" "}
              <a
                href="mailto:soporte@manosquehablan.app"
                className="text-primary underline underline-offset-2"
              >
                soporte@manosquehablan.app
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Al utilizar Manos que Hablan, declaras haber leído y aceptado estos Términos de Uso y
          nuestra{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
