import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import useSEO from '../utils/useSEO'
import './TermsAndConditions.css'

export default function TermsAndConditions({ onNavigate, onLoginClick, cartCount }) {
  useSEO({
    title: 'Terms & Conditions | Aloweda',
    description: 'Read Aloweda\'s terms and conditions, privacy policy, return policy and shipping information.',
    canonical: '/terms',
  })
  const sections = [
    {
      title: 'Privacy',
      content: 'Please review our Privacy Policy so that you may understand our privacy practices.'
    },
    {
      title: 'Payment Policy',
      content: 'Please see our Payment Policy to understand the purchase processes of our products. All international shipping orders may attract local duties applicable in that country and the customer will have to pay accordingly locally.'
    },
    {
      title: 'Products & Services for Personal Use',
      content: 'The products and services described on this website, and any samples thereof we may provide to you, are for personal use only. You may not sell or resell any of the products or services, or samples thereof, you receive from us. We reserve the right, with or without notice, to cancel or reduce the quantity of any products or services to be provided to you that we believe, in our sole discretion, may result in the violation of our Terms and Conditions.'
    },
    {
      title: 'Accuracy of Information',
      content: 'We attempt to be as accurate as possible when describing our products on the website. However, except to the extent implied by applicable law, we do not warrant that the product descriptions, colors, information, or other content available on the website are accurate, complete, reliable, current, or error-free.'
    },
    {
      title: 'Manufacturing Information',
      content: 'All our products are manufactured & marketed by:\n\nAloweda Wellness Products Private Limited\nOman Topaz, Sarjapur Road,\nBangalore 560 102, India\nPhone: +91 80 22555227'
    },
    {
      title: 'Intellectual Property',
      content: 'All information and content available on the website and its "look and feel", including but not limited to trademarks, logos, service marks, text, graphics, logos, button icons, images, audio clips, data compilations and software, and the compilation and organization thereof (collectively, the "Content") is the property of Aloweda, our Affiliates, partners or licensors, and is protected by laws of India, including laws governing all applicable forms of intellectual property.\n\nExcept as set forth in the limited licenses in Section 7, or as required under applicable law, neither the Content nor any portion of this website may be used, reproduced, duplicated, copied, sold, resold, accessed, modified, or otherwise exploited, in whole or in part, for any purpose without our express, prior written consent.'
    },
    {
      title: 'Limited Licenses',
      content: 'We grant you a limited, revocable, and non-exclusive license to access and make personal use of Aloweda website. This limited license does not include the right to: (a) frame or utilize framing techniques to enclose the website or any portion thereof; (b) republish, redistribute, transmit, sell, license or download the website or any and/or all Content (except caching or as necessary to view the website); (c) make any use of the website or any and/or all Content other than personal use; (d) modify, reverse engineer or create any derivative works based upon either the website or any and/or all Content; (e) collect account information for the benefit of yourself or another party; (f) use any meta tags or any other "hidden text" utilizing any and/or all Content; or (g) use software robots, spiders, crawlers, or similar data gathering and extraction tools, or take any other action that may impose an unreasonable burden or load on our infrastructure. You must retain, without modification, all proprietary notices on the website or affixed to or contained in the website.\n\nWe also grant you a limited, revocable, and nonexclusive license to create a hyperlink to the homepage of the website for personal, non-commercial use only. A website that links to the website (i) may link to, but not replicate, any and/or all of our Content; (ii) may not imply that we are endorsing such website or its services or products; (iii) may not misrepresent its relationship with us; (iv) may not contain content that could be construed as distasteful, obscene, offensive, controversial or illegal or inappropriate for any ages; (v) may not portray us or our products or services, in a false, misleading, derogatory, or otherwise offensive or objectionable manner, or associate us with undesirable products, services, or opinions; and (vi) may not link to any page of the website other than the home page.\n\nAny unauthorized use by you of the Aloweda website or any and/or all of our Content automatically terminates the limited licenses set forth in this Section without prejudice to any other remedy provided by applicable law or these Terms and Conditions.'
    },
    {
      title: 'Your Obligations and Responsibilities',
      content: 'In the access or use of the Aloweda website, you shall comply with these Terms and Conditions and the special warnings or instructions for access or use posted on the website. You shall act always in accordance with the law, custom and in good faith. You may not make any change or alteration to the website or any Content or services that may appear on this website and may not impair in any way the integrity or operation of the website.\n\nWithout limiting the generality of any other provision of these Terms and Conditions, if you default negligently or deliberately in any of the obligations set forth in these Terms and Conditions, you shall be liable for all the losses and damages that this may cause to Aloweda, our Affiliates, partners or licensors.'
    },
    {
      title: 'Third Party Links',
      content: 'We are not responsible for the content of any off-website pages or any other websites linked to or from the Aloweda website. Links appearing on this website are for convenience only and are not an endorsement by us, our affiliates, or our partners of the referenced content, product, service, or supplier. Your linking to or from any off-website pages or other websites is at your own risk.\n\nWe are in no way responsible for examining or evaluating, and we do not warrant the offerings of, off-website pages or any other websites linked to or from the site, nor do we assume any responsibility or liability for the actions, content, products, or services of such pages and websites, including, without limitation, their privacy policies and terms and conditions. You should carefully review the terms and conditions and privacy policies of all off-website pages and other websites that you visit.'
    },
    {
      title: 'Special Features, Functionality, and Events',
      content: 'Aloweda may offer certain special features and functionality or events (such as contests, promotions, or other offerings) which may (a) be subject to terms of use, rules, and/or policies in addition to or in lieu of these Terms and Conditions; and (b) be offered by us or by third parties. If so, we will notify you of this and if you choose to take advantage of these offerings, you agree that your use of those offerings will be subject to such additional or separate terms of use, rules, and/or policies.'
    },
    {
      title: 'Submissions',
      content: 'It is our policy to decline unsolicited suggestions and ideas. Notwithstanding our policy with regard to unsolicited suggestions and ideas, any inquiries, feedback, suggestions, ideas or other information you provide us (collectively, "Submissions") will be treated as non-proprietary and non-confidential.\n\nSubject to the terms of our Privacy Policy, by transmitting or posting any Submission, you hereby grant us the right to copy, use, reproduce, modify, adapt, translate, publish, license, distribute, sell or assign the Submission in any way as we see fit, including but not limited to copying in whole or in part, creating derivative works from, distributing and displaying any Submission in any form, media, or technology, whether now known or hereafter developed, alone or as part of other works, or using the Submission within or in connection with our products or services.\n\nIf you make a Submission, you represent and warrant that you own or otherwise control the rights to your Submission. You further represent and warrant that such Submission does not constitute or contain software viruses, commercial solicitation, chain letters, mass mailings, or any form of "spam". You may not use a false email address, impersonate any person or entity, or otherwise mislead us as to the origin of any Submission. You agree to indemnify us for all claims arising from or in connection with any claims to any rights in any Submission or any damages arising from any Submission.'
    },
    {
      title: 'User Content',
      content: 'When you transmit, upload, post, e-mail or otherwise make available data, text, software, music, sound, photographs, graphics, images, videos, messages or other materials ("User Content") on the website, you are entirely responsible for such User Content. Such User Content constitutes a Submission under these Terms and Conditions.'
    }
  ]

  return (
    <div className="tnc-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      <div className="tnc-hero">
        <div className="tnc-hero-inner">
          <p className="tnc-eyebrow">Legal</p>
          <h1 className="tnc-title">Terms of Service</h1>
          <p className="tnc-subtitle">Terms and Conditions of Aloweda.com</p>
        </div>
      </div>

      <div className="tnc-container">
        {/* Intro */}
        <div className="tnc-intro">
          <p>
            Aloweda provides you with the content and services available on this website, subject to the
            following Terms and Conditions, our Privacy Policy, Payment Policy, and other conditions and
            policies which you may find throughout our website, in connection with certain functionality,
            features, or promotions, as well as customer service, all of which are deemed a part of and
            included within these terms and conditions (collectively, "Terms and Conditions"). By accessing
            or using this website, you are acknowledging that you have read, understood, and you agree,
            without limitation or qualification, to be bound by these Terms and Conditions.
          </p>
          <p className="tnc-effective">
            <strong>Effective Date:</strong> These Terms and Conditions are effective as of 23rd July 2024
          </p>
        </div>

        {/* Sections */}
        <div className="tnc-sections">
          {sections.map((section, index) => (
            <div key={index} className="tnc-section">
              <div className="tnc-section-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="tnc-section-body">
                <h2 className="tnc-section-title">{section.title}</h2>
                <div className="tnc-section-content">
                  {section.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="tnc-footer-note">
          <p>For any queries regarding these Terms and Conditions, please contact us at <a href="mailto:ajay@vironwellness.in">ajay@vironwellness.in</a></p>
        </div>
      </div>

      <Footer onNavigate={onNavigate} onLoginClick={onLoginClick} />
    </div>
  )
}
