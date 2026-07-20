// emails/VerificationEmail.tsx
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  verificationLink: string;
}

export const VerificationEmail = ({ name, verificationLink }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for JobHub</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>JobHub</Heading>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Thanks for signing up for JobHub! Please verify your email address by clicking the button below.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify Email
          </Button>
        </Section>
        <Text style={paragraph}>
          Or copy and paste this link into your browser:
          <br />
          <Link href={verificationLink} style={link}>
            {verificationLink}
          </Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>If you didn't create an account, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
);

VerificationEmail.PreviewProps = {
  name: "John",
  verificationLink: "https://jobhub.com/verify?token=123",
} as VerificationEmailProps;

export default VerificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 16px",
  padding: "0",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#5469d4",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "16px",
};