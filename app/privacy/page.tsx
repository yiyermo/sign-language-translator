import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="Manos que Hablan Logo"
            className="h-14 w-auto hover:opacity-90 transition"
          />
        </Link>
        <h1 className="text-4xl font-bold mb-2">Política de Privacidad de Manos que Hablan</h1>
        <p className="text-muted-foreground">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Esta Política de Privacidad explica cómo Manos que Hablan recopila, utiliza y protege
          tus datos personales cuando utilizas nuestro sitio web y nuestro traductor de Lengua
          de Señas Chilena.
        </p>
      </div>

      {/* 0. RESPONSABLE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>0. Responsable del tratamiento y ámbito de aplicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            El responsable del tratamiento de los datos personales es{" "}
            <strong>Manos que Hablan</strong>, proyecto académico de desarrollo de software
            orientado a la accesibilidad comunicacional.
          </p>
          <p>
            Si tienes dudas o solicitudes relacionadas con la protección de tus datos, puedes
            contactarnos en:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Correo privacidad:</strong>{" "}
              <a
                href="mailto:privacidad@manosquehablan.app"
                className="text-primary underline underline-offset-2"
              >
                privacidad@manosquehablan.app
              </a>
            </li>
            <li>
              <strong>Correo general de soporte:</strong>{" "}
              <a
                href="mailto:soporte@manosquehablan.app"
                className="text-primary underline underline-offset-2"
              >
                soporte@manosquehablan.app
              </a>
            </li>
          </ul>
          <p className="text-xs mt-2">
            Manos que Hablan es un proyecto académico y no reemplaza asesoría jurídica ni
            servicios profesionales especializados.
          </p>
        </CardContent>
      </Card>

      {/* 1. INFORMACIÓN QUE RECOPILAMOS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Información que recopilamos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1.1 Información de cuenta</h3>
            <p className="text-muted-foreground">
              Cuando creas una cuenta en Manos que Hablan, podemos recopilar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Contraseña (almacenada de forma encriptada)</li>
              <li>Fecha y hora de registro</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">1.2 Información de uso del servicio</h3>
            <p className="text-muted-foreground">
              Para poder mejorar la plataforma y ofrecerte funcionalidades adicionales, podemos
              registrar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Historial de traducciones (texto ingresado y modo de traducción utilizado)</li>
              <li>Fecha y hora de cada sesión de uso</li>
              <li>Frecuencia de uso del traductor</li>
              <li>Preferencias y configuraciones que guardes en la plataforma</li>
            </ul>
            <p className="text-xs mt-2">
              El contenido de las traducciones se utiliza únicamente para prestar el servicio y
              mejorar su funcionamiento; no se publica ni se comparte con terceros con fines
              publicitarios.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">1.3 Información técnica</h3>
            <p className="text-muted-foreground">
              De manera automática, cuando accedes al sitio, podemos recopilar cierta información
              técnica, como:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Dirección IP aproximada</li>
              <li>Tipo y versión de navegador</li>
              <li>Sistema operativo y tipo de dispositivo</li>
              <li>Páginas visitadas dentro del sitio y tiempo de navegación</li>
              <li>Identificadores técnicos necesarios para la autenticación y seguridad</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 2. CÓMO UTILIZAMOS TU INFORMACIÓN */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Cómo utilizamos tu información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Manos que Hablan utiliza la información recopilada para:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Proporcionar y mantener el servicio de traducción de Lengua de Señas Chilena.</li>
            <li>
              Permitir la autenticación de usuarios, gestión de cuentas y acceso a tu historial.
            </li>
            <li>
              Mejorar la precisión, usabilidad y rendimiento del traductor y de la plataforma en
              general.
            </li>
            <li>
              Personalizar ciertos aspectos de la experiencia (por ejemplo, preferencias de
              interfaz).
            </li>
            <li>Generar estadísticas de uso agregadas y anónimas.</li>
            <li>
              Enviar avisos importantes relacionados con el funcionamiento del servicio (por
              ejemplo, cambios de políticas o avisos técnicos).
            </li>
            <li>Detectar y prevenir actividad fraudulenta, abuso o accesos no autorizados.</li>
            <li>Cumplir con obligaciones legales que puedan ser aplicables.</li>
          </ul>
        </CardContent>
      </Card>

      {/* 3. BASE LEGAL (OPCIONAL/GENERAL) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Base legal para el tratamiento de datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            En términos generales, Manos que Hablan trata tus datos personales sobre las
            siguientes bases:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Ejecución de la relación contigo como usuario:</strong> para crear y
              gestionar tu cuenta y prestarte el servicio de traducción.
            </li>
            <li>
              <strong>Consentimiento:</strong> cuando aceptas expresamente la política de
              privacidad y el uso de determinadas funcionalidades.
            </li>
            <li>
              <strong>Interés legítimo:</strong> para mejorar el servicio, garantizar la
              seguridad de la plataforma y elaborar estadísticas agregadas.
            </li>
            <li>
              <strong>Cumplimiento de obligaciones legales:</strong> cuando alguna normativa
              exija conservar o facilitar ciertos datos.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 4. COMPARTIR INFORMACIÓN */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Compartir información con terceros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Manos que Hablan no vende ni arrienda tu información personal a terceros. Solo
            compartimos datos en los siguientes casos limitados:
          </p>

          <div>
            <h3 className="font-semibold mb-2">4.1 Proveedores de servicios</h3>
            <p className="text-muted-foreground">
              Utilizamos proveedores externos para alojar la plataforma y gestionar ciertos
              aspectos técnicos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>
                <strong>Supabase:</strong> para autenticación y almacenamiento de datos.
              </li>
              <li>Servicios de hosting y CDN para servir la web de forma segura y rápida.</li>
              <li>Herramientas de análisis técnico y métricas de uso en forma agregada.</li>
            </ul>
            <p className="text-xs mt-2">
              Estos proveedores solo acceden a la información necesaria para prestar sus
              servicios y están obligados a tratarla de forma segura y confidencial.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4.2 Requisitos legales y protección</h3>
            <p className="text-muted-foreground">
              Podremos revelar información personal si creemos de buena fe que es razonablemente
              necesario para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
              <li>Cumplir con una ley, reglamento o requerimiento legal aplicable.</li>
              <li>Responder a requerimientos válidos de autoridades competentes.</li>
              <li>
                Proteger los derechos, la seguridad o la integridad de Manos que Hablan, de sus
                usuarios o de terceros.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 5. SEGURIDAD */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Seguridad de los datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            En Manos que Hablan aplicamos medidas técnicas y organizativas razonables para
            proteger tu información personal frente a accesos no autorizados, pérdida o
            destrucción accidental, entre ellas:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Contraseñas almacenadas mediante algoritmos de cifrado robustos.</li>
            <li>Comunicación cifrada mediante HTTPS/SSL.</li>
            <li>Restricción de acceso a datos personales únicamente a quienes lo necesitan.</li>
            <li>Revisión periódica de la configuración de seguridad y dependencias técnicas.</li>
            <li>Copias de seguridad periódicas de la base de datos.</li>
          </ul>
          <p className="mt-4 text-sm">
            A pesar de estas medidas, ningún sistema es completamente infalible. No podemos
            garantizar la seguridad absoluta de la información transmitida a través de Internet.
          </p>
        </CardContent>
      </Card>

      {/* 6. RETENCIÓN */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Plazos de conservación de los datos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Conservamos tus datos personales mientras tu cuenta de Manos que Hablan se
            encuentre activa y sea necesario para prestarte el servicio.
          </p>
          <p>
            Si solicitas la eliminación de tu cuenta, procederemos a desactivarla y eliminar o
            anonimizar tus datos personales en un plazo razonable (por regla general, dentro de
            los 30 días siguientes), salvo aquellos que debamos conservar por obligación legal o
            por motivos de seguridad.
          </p>
        </CardContent>
      </Card>

      {/* 7. DERECHOS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Tus derechos sobre tus datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Como usuario de Manos que Hablan, puedes ejercer los siguientes derechos:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Acceso:</strong> solicitar confirmación sobre si tratamos tus datos y
              obtener una copia.
            </li>
            <li>
              <strong>Rectificación:</strong> pedir la corrección de datos inexactos o
              incompletos.
            </li>
            <li>
              <strong>Eliminación:</strong> solicitar la eliminación de tu cuenta y datos
              personales, salvo obligación legal de conservación.
            </li>
            <li>
              <strong>Limitación y oposición:</strong> oponerte a ciertos tratamientos o
              solicitar que se limite el uso de tus datos en algunos casos.
            </li>
            <li>
              <strong>Portabilidad:</strong> solicitar, cuando proceda, la entrega de tus datos
              en un formato estructurado y de uso común.
            </li>
            <li>
              <strong>Revocación del consentimiento:</strong> cuando el tratamiento se base en
              tu consentimiento, puedes retirarlo en cualquier momento.
            </li>
          </ul>
          <p className="mt-4">
            Para ejercer cualquiera de estos derechos, puedes escribirnos a{" "}
            <strong>privacidad@manosquehablan.app</strong>. Es posible que te pidamos
            información adicional para verificar tu identidad antes de atender tu solicitud.
          </p>
        </CardContent>
      </Card>

      {/* 8. COOKIES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Cookies y tecnologías similares</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Manos que Hablan puede utilizar cookies y tecnologías similares (como almacenamiento
            local en el navegador) para:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Cookies esenciales:</strong> necesarias para el correcto funcionamiento del
              sitio y la autenticación de usuarios.
            </li>
            <li>
              <strong>Cookies de preferencias:</strong> para recordar configuraciones (por
              ejemplo, idioma de la interfaz).
            </li>
            <li>
              <strong>Cookies o tecnologías analíticas:</strong> para obtener estadísticas
              anónimas de uso y mejorar la experiencia.
            </li>
          </ul>
          <p className="mt-4">
            Puedes configurar tu navegador para rechazar o bloquear cookies, aunque esto podría
            afectar el funcionamiento de algunas partes del sitio.
          </p>
        </CardContent>
      </Card>

      {/* 9. MENORES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Privacidad de menores de edad</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            El uso de Manos que Hablan está destinado principalmente a personas mayores de 14
            años. No recopilamos deliberadamente información personal de menores de 14 años sin
            el consentimiento verificable de sus madres, padres o tutores legales.
          </p>
          <p>
            Si eres madre, padre o tutor/a y crees que un menor bajo tu cuidado ha proporcionado
            datos personales a través de nuestro sitio sin tu consentimiento, por favor
            contáctanos en{" "}
            <strong>privacidad@manosquehablan.app</strong> para revisar el caso y, en su caso,
            eliminar esa información.
          </p>
        </CardContent>
      </Card>

      {/* 10. TRANSFERENCIAS INTERNACIONALES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Transferencias internacionales de datos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Algunos de nuestros proveedores tecnológicos (como servicios de hosting o bases de
            datos en la nube) pueden encontrarse fuera de tu país de residencia. En estos casos,
            procuramos que se apliquen garantías adecuadas de protección de datos, como contratos
            que incorporen cláusulas estándar o políticas de privacidad alineadas con buenas
            prácticas internacionales.
          </p>
        </CardContent>
      </Card>

      {/* 11. CAMBIOS A LA POLÍTICA */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>11. Cambios en esta Política de Privacidad</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Manos que Hablan podrá actualizar esta Política de Privacidad cuando sea necesario
            para reflejar cambios en el servicio, requisitos legales o buenas prácticas de
            protección de datos.
          </p>
          <p>
            Cuando realicemos cambios relevantes, actualizaremos la fecha de &quot;Última
            actualización&quot; al inicio de este documento y, cuando corresponda, podremos
            notificarte por medios visibles dentro de la plataforma.
          </p>
          <p>
            Te recomendamos revisar periódicamente esta página para mantenerte informado sobre
            cómo protegemos tu información.
          </p>
        </CardContent>
      </Card>

      {/* 12. CONTACTO */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>12. Contacto</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            Si tienes preguntas, comentarios o solicitudes relacionadas con esta Política de
            Privacidad o con el tratamiento de tus datos personales, puedes escribirnos a:
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
          Al utilizar Manos que Hablan, declaras haber leído y aceptado esta Política de
          Privacidad y nuestros{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Términos de Uso
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
