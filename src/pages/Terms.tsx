
import React from 'react';
import TermsHero from '@/components/hero/page-specific/TermsHero';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <TermsHero />
      
      <section className="py-24 px-6 max-w-6xl mx-auto" data-section="terms">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAFAFA]">Terms of Service</h1>
          <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto">
            Please review our terms and conditions for using the Shattara platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#2E2E2E] space-y-8">
            
            <div className="mb-8">
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                Welcome to Shattara!
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                Please take time to read these terms and conditions of use for Shattara and any terms and policies that
                they reference (jointly "Shattara Terms"). The Shattara Terms are a legally binding agreement between the
                consumer that makes the order ("You") and the seller Shattara AI LLC, contact, registration number
                [REGISTRATION NUMBER] ("Shattara") and cover Your access to and use of the service for learning
                support, related software applications and all the content and other material offered on the service by
                Shattara from time to time (jointly "Shattara Service").
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                You acknowledge that the Shattara Service is only available to individuals who:
              </p>
              <ul className="list-disc list-inside text-[#A6A6A6] mt-2 space-y-1 ml-4 mb-4">
                <li>(i) are 18 years or older, or between 13 and 18 years old and have parental consent,</li>
                <li>(ii) have the power to enter into a binding agreement with Shattara, and are not barred from doing so under any applicable law,</li>
                <li>(iii) are a resident of Saudi Arabia or a country in which the Shattara Service is available, and</li>
                <li>(iv) use the Shattara Service for private non-commercial use.</li>
              </ul>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                By accepting the Shattara Terms and/or accessing or using the Shattara Service, you acknowledge that
                you have entered into an agreement with Shattara and represent and warrant that you meet the above
                requirements.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed">
                Our terms of use and all other related documents are written in Arabic and English. The Arabic version
                shall prevail in case of discrepancy between the two versions. By entering into an agreement with
                Shattara, you accept and agree to the use of these languages in these matters.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">1. Definitions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.1. Shattara</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    We as a company, Shattara AI LLC (Registration Number: [REGISTRATION NUMBER])
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.2. You / Customer / User</h3>
                  <div className="ml-4 space-y-2">
                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-1">1.2.1. Paying customer</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">Refer to any Customer having an active Order Confirmation.</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-1">1.2.2. Free customer</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">A Customer without a valid Subscription.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.3. Agreement</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    Refer to the agreement between Shattara and you as a consumer including these T&Cs and any relevant
                    Associated Documents.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.4. Parties</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">Both of us – we, Shattara, and you, the Customer.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.5. Effective date</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">Refer to the moment when the Agreement becomes valid between the Parties.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.6. Subscription</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">A Service provided to the Paid Customer on a recurring basis under Order Confirmation.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.7. Platform</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">The online learning support system provided by Shattara. Referred to as "The Platform" or "The Service".</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.8. Associated documents</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">Documents referred in this Agreement or that are published at shattara.com</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.9. Term</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    Any period of time specified in an Order Confirmation where A Paying or Free Customer has access to the
                    Platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-2">1.10. Shattara Account</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">Password protected user-account created on shattara.com</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">2. The Shattara Platform</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">2.1. Your Shattara account</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    In order to use the Shattara Platform, You will have to create a password protected account ("Shattara
                    Account"). You represent and warrant that all information You provide to Shattara is accurate and correct,
                    and that You will keep the information up to date. You agree not to share Your Shattara Account or
                    password and that You are solely responsible for all activity that occurs on Your Shattara Account
                    (including any unauthorized use). If you purposefully share your Account password with others, Shattara
                    reserves the right to terminate your Subscription with immediate effect without reimbursement for the
                    remaining Term. If You believe there has been any unauthorized access or use of Your Shattara Account,
                    You must notify Shattara immediately and change Your password as soon as possible. Shattara will not be
                    responsible for any activities on Your Shattara Account unless it has been caused by Shattara's
                    negligence.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">2.2. Membership and payment</h3>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.2.1. Acceptance</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        The Agreement becomes valid when You complete the sign-up form on the Platform incl. payment.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.2.2. Payment</h4>
                      <div className="ml-4 space-y-3">
                        <div>
                          <h5 className="text-base font-medium text-[#E3E3E3] mb-1">2.2.2.1. General</h5>
                          <p className="text-[#A6A6A6] leading-relaxed mb-3">
                            Unless otherwise specified in the Order Confirmation, all fees are in Saudi Riyal (SAR).
                            Fees shall be added with applicable Value-Added Tax and any other mandatory taxes as per Saudi
                            Arabian tax regulations.
                          </p>
                          <p className="text-[#A6A6A6] leading-relaxed mb-3">
                            Payment for the Services is due upon completion of the sign-up form on the Platform, after which the
                            fees are payable in advance for each future Term during the duration of the Agreement.
                          </p>
                          <p className="text-[#A6A6A6] leading-relaxed">
                            The Payment is handled via third party service providers which accept most Saudi and international
                            payment cards and methods, including SADAD payment system.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.2.3. Activation (delivery)</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        Immediately after the Agreement becomes valid, you will gain access to the Platform with your Shattara
                        Account.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.2.4. Withdrawal</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        As per Saudi Arabian Consumer Protection Law, you have the right to cancel your purchase within 7 days
                        from the date of activating the service, provided that you have not substantially used the service. All other
                        Services are non-cancellable during the Term, and all fees are non-refundable unless otherwise specified
                        in the Order Confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">2.3. Duration, renewal and termination</h3>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.3.1. Duration</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        The Agreement remains valid for the Initial Term (and any subsequent Term), except if terminated in
                        accordance with this section.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.3.2. Automatic renewal</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        At the end of a Term, the Order Confirmation including Associated Documents and these Terms &
                        Conditions renews automatically with the then-current, standard non-discounted price for an additional
                        Term of the same duration as the preceding Term excluding the length of any free Trial period.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.3.3. Changes</h4>
                      <p className="text-[#A6A6A6] leading-relaxed mb-3">
                        The prices, features, and options of the Services depend on the Subscription selected by the Paid
                        Customer.
                      </p>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        Shattara has the right to adjust the prices, features, or options included in the Paid Customer Services,
                        provided that the changes shall not take effect until the next Term. Shattara informs the Paid Customer of
                        any changes in the prices (except for increase specified in 2.3.2 as part of renewal), features, or options for
                        the subsequent renewal by a written notice no later than 30 days prior to the end of the current Term.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.3.4. Termination</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        Your subscription to Shattara will continue until terminated by You or Shattara. You may terminate your
                        Subscription with effect from the end of the current Term by emailing Shattara on support@shattara.com
                        and request that Your Shattara Account is closed, or by simply deleting Your account in Your account
                        settings and by ceasing all other access to and use of the Shattara Service. Finally, You can stop your
                        subscription but keep your Account by Canceling Your Subscription in Your account settings. Shattara
                        may pause, suspend or terminate Your access to the Shattara Service or any part thereof at our discretion
                        including but not limited to if You have violated the Shattara Terms. All fees are non-refundable unless
                        otherwise specified in the Order Confirmation or under Saudi Arabian Consumer Protection Law.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.3.5. Free Access</h4>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        Shattara may offer access to the platform free of charge to "Free users". Shattara reserves the right to
                        determine Your eligibility for Free Access and may revoke or modify the Access at any time without prior
                        notice with no liability to you. The Free Access is limited by usage, defined across various activity metrics
                        on the platform. Shattara reserves the right to change the limitations of the Free Access, vary the limits
                        between individual users and to entirely revoke the Free Access to the platform. Shattara also reserves the
                        right to completely lock certain features from the Free Access, such that they can only be unlocked by
                        Paying customers. When the user reaches their monthly limit they will lose access to the Platform and be
                        met by a payment pop-up that offers them a Subscription to the platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">2.4. Using the Platform</h3>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.4.1. Requirements of the customer</h4>
                      <p className="text-[#A6A6A6] leading-relaxed mb-3">
                        The Customer confirms that they are of legal age (18 years or older) or have parental consent and are
                        legally capable of entering into the Agreement.
                      </p>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        The Customer confirms that they use products and services offered by Shattara solely for their own
                        personal learning. Shattara does not provide its solutions to business or institutions unless through a
                        specific business agreement.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.4.2. Uploaded content/input</h4>
                      <p className="text-[#A6A6A6] leading-relaxed mb-3">
                        By signing up for and using the platform, the Customer confirms and acknowledges that they are the
                        rightful owner of all materials they upload or submit to the platform. You affirm that you hold all
                        necessary rights, licenses, and permissions to use and share the content within the platform to be used
                        strictly for the Customer's own private use according to applicable Saudi Arabian copyright laws.
                      </p>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        The Customer also confirms that all uploaded content complies with the laws and regulations of the
                        Kingdom of Saudi Arabia, including but not limited to respecting Islamic values and traditions, and does
                        not contain material that violates public morality or order.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.4.3. Obligations of the Customer</h4>
                      <p className="text-[#A6A6A6] leading-relaxed mb-3">
                        If the Customer becomes aware of any unauthorized use of the Platform, the Customer shall promptly
                        inform Shattara.
                      </p>
                      <p className="text-[#A6A6A6] leading-relaxed mb-2">
                        The Customer, and any third party they involve, must not under any circumstances:
                      </p>
                      <ul className="list-disc list-inside text-[#A6A6A6] ml-4 space-y-1 mb-3">
                        <li>Share, sell, or give access to the Platform to third parties;</li>
                        <li>Reverse engineer or seek to obtain the source code of the Platform;</li>
                        <li>Bypass security measures, or configure the Platform to avoid fees or in any way disrupt the integrity or security;</li>
                        <li>Access the Platform for the purpose of building a competitive product or service or copying its features;</li>
                        <li>Use or permit the Platform to be used for any illegal or misleading purpose;</li>
                        <li>Upload, share or distribute content that violates Islamic values, Saudi Arabian laws, or public morality;</li>
                        <li>Collect, use, and disclose data that violates any third-party rights.</li>
                      </ul>
                      <p className="text-[#A6A6A6] leading-relaxed">
                        The Customer confirms that they will only use The Platform within the guidelines of the use of AI/LLMs as
                        prescribed by the educational institution they attend. Using the Platform to violate the Customer's
                        school's exam and teaching rules is a violation of the Agreement, and Shattara reserves the right to
                        terminate the Customer's subscription immediately and without reimbursement in such cases.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">2.5. Performance guarantee</h3>
                  <p className="text-[#A6A6A6] leading-relaxed mb-4">
                    Shattara does not offer any guarantee to the Customer that their learning will benefit from using the
                    Platform. Shattara cannot be held responsible for the exam results of the Customer or other type of
                    assessment of the Customer.
                  </p>
                  
                  <div>
                    <h4 className="text-lg font-medium text-[#E3E3E3] mb-2">2.5.1. Money-back guarantee</h4>
                    <p className="text-[#A6A6A6] leading-relaxed">
                      If the subscription plan the Customer has signed up on offers a money-back guarantee in the case the
                      Customer fails a course, the Customer can contact support@shattara.com to claim the money back. In
                      order to be qualified for the money-back guarantee, the Customer must have received a final course
                      assessment (i.e., grade or "Pass/Fail") on a course that does not qualify for an official passing grade at the
                      university the Customer attends. To be qualified for the money-back guarantee, the Customer must have
                      spent a meaningful amount of time on the Shattara platform. Shattara reserves the right to require proof
                      of the assessment via the official grade print-out from the Customer's university.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">3. Service level</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                Shattara will make reasonable efforts to ensure that the Platform is online and accessible 97% of the time
                month by month.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                Shattara is committed to swiftly resolving the cause of any disruption and making reasonable efforts to
                promptly notify the Customer.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-2">The following circumstances are excluded from the Uptime:</p>
              <ul className="list-disc list-inside text-[#A6A6A6] ml-4 space-y-1 mb-4">
                <li>Service work notified and agreed upon between the parties outside of normal working hours;</li>
                <li>Force Majeure conditions;</li>
                <li>The Customer's own circumstances that make it impossible or substantially complicate the provision of Services.</li>
              </ul>
              
              <div>
                <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">3.1. Downtime</h3>
                <p className="text-[#A6A6A6] leading-relaxed">
                  Shattara is not liable for any unforeseen technical issues, causing the platform to malfunction. We advise
                  the Customer to not rely solely on the accessibility of Shattara for exam critical material and content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">4. Data and ownership</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                When the Customer uploads content to Shattara, the content remains the property of the Customer, and
                Shattara does not claim ownership of the content. The Customer does not obtain ownership of the
                output material generated by the Shattara platform, and only has access to the output as long as they
                have an active Shattara subscription. Shattara does not claim copyright ownership of the output material.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed mb-4">
                When the Customer uploads material to the platform, they acknowledge that they are the rightful owner
                of the material and that they hold all necessary rights, licenses, and permissions to use and share the
                content within the platform. Shattara does not share or make the uploaded material accessible to anyone
                else than the Customer himself.
              </p>
              <p className="text-[#A6A6A6] leading-relaxed">
                We refer to our Privacy policy for all matters concerning how we store and handle data, which is
                compliant with the Saudi Arabian Personal Data Protection Law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">5. Other</h2>
              <p className="text-[#A6A6A6] leading-relaxed">
                This Agreement is the entire agreement between the Parties. It replaces all the agreements, promises, and
                things said or written by the Parties about the same topic.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">6. Limited liability</h2>
              <p className="text-[#A6A6A6] leading-relaxed mb-2">
                Shattara shall not be liable for the Platform regardless of the form of any claim or action (whether in
                contract, negligence, strict liability, or otherwise) for:
              </p>
              <ul className="list-disc list-inside text-[#A6A6A6] ml-4 space-y-1">
                <li>Loss or corruption of data or recovery of data</li>
                <li>Security breach resulting from a failure of a third party internet</li>
                <li>Any matter beyond Shattara's reasonable control</li>
                <li>Exam results or any other type of evaluation made of the Customer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">7. Governing Law and Dispute Resolution</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">7.1. Before Dispute arises</h3>
                  <p className="text-[#A6A6A6] leading-relaxed mb-3">
                    Most disputes can be solved without legal action. If the Customer has a legal issue with Shattara, the
                    Parties agree to try to work things out together.
                  </p>
                  <p className="text-[#A6A6A6] leading-relaxed mb-3">
                    Before any formal actions or legal proceedings, the Customer shall contact Shattara's support at
                    support@shattara.com. The message shall provide a brief written description and include contact details.
                  </p>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    Shattara does its best to resolve disputes through friendly discussions and sincere efforts. It is important
                    that both Parties genuinely aim to find a solution before pursuing the legal route. This is for the benefit of
                    both Parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">7.2. Governing Law</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    This Agreement shall be governed by and construed in accordance with the laws and regulations of the
                    Kingdom of Saudi Arabia, including Islamic Sharia law principles as applicable in the Kingdom.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#E3E3E3] mb-3">7.3. Dispute resolution</h3>
                  <p className="text-[#A6A6A6] leading-relaxed">
                    If there's a dispute that cannot be resolved through negotiations between the Parties, it will be finally
                    settled by the competent courts in the Kingdom of Saudi Arabia.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Terms;
