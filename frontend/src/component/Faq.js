import React from "react";


const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 bg-gray-100 mt-8">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        FAQ about creating an invoice.
      </h1>

      {/* FAQ Items */}
      <div className="space-y-8">
        {/* What is an invoice? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">What is an invoice?</h2>
          <p className="text-sm md:text-base leading-relaxed">
            An invoice is an itemized bill issued by anyone selling goods or
            services. An invoice will detail the agreed prices or fees, and list
            out the products or services that have been provided. Upon receipt,
            the buyer will settle the invoice.
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2">
            Invoices have a practical purpose - making sure you get paid for
            goods or services you've provided a customer. They can also help to
            create a professional impression and build client relationships, as
            well as acting as a legal record of sales made.
          </p>
        </div>

        {/* Can I edit my invoices? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Can I edit my invoices?</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Yes. Simply edit the information in our{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              free invoice generator
            </a>{" "}
            tool and add your own company logo to give a professional finish.
            Create your PDF invoice when you're ready - and continue to edit
            your invoice with a PDF editor tool if you need to.
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2">
            You can also get a fully customizable solution by using our{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice templates
            </a>{" "}
            which come in{" "}
            <a href="#" className="text-blue-500 underline ml-3">
              Google Docs
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline">
              Google Sheets
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline ">
              Word
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline ">
              Excel
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 underline ">
              PDF
            </a>{" "}
            formats.
          </p>
        </div>

        {/* Can I change the currency? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Can I change the currency on the invoice?
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            Choose the currency you're billing in by simply selecting it in the{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice maker
            </a>
            . Then get paid into your Wise Business account to cut currency
            conversion fees and keep more of your hard-earned cash.
          </p>
        </div>

        {/* Can I put my own logo? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Can I put my own logo on the invoice?
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            Yes, our free{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice maker
            </a>{" "}
            lets you add your own company logo. Just select the logo box in the
            top right corner, and upload your logo or drag and drop it into
            place. Both JPG and PNG images are supported.
          </p>
        </div>

        {/* How do I send my invoice? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">How do I send my invoice?</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Create an invoice in our{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice generator
            </a>{" "}
            and easily download a PDF copy. You can then attach it to your email
            or message to your client.
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2">
            If you send a link to your customer, they can download or print the
            invoice from the link - with no need to wait for the mail to arrive.
          </p>
        </div>

        {/* Can I set up recurring invoices? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Can I set up recurring invoices?
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            It's not possible to set up recurring invoices at the moment. That's
            because the{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice generator
            </a>{" "}
            works separate from your Wise user account and no data is saved when
            you use it.
          </p>
        </div>

        {/* Can I create invoices in different languages? */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Can I create invoices in different languages?
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            At the moment the{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice generator
            </a>{" "}
            only creates invoices in English.
          </p>
          <p className="text-sm md:text-base leading-relaxed mt-2">
            However, we have great free{" "}
            <a href="#" className="text-blue-500 underline mx-3">
              invoice templates
            </a>{" "}
            available in 6 different languages -{" "}
            <a href="#" className="text-blue-500 underline ml-3">
              English
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline">
              French
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline">
              German
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline ">
              Spanish
            </a>
            ,{" "}
            <a href="#" className="text-blue-500 underline">
              Japanese
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 underline">
              Cantonese
            </a>
            . Pick the languages and the format ypu need and create invoice in just a few moments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
