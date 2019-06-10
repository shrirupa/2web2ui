import { useEffect, useState } from 'react';

const useEditorContent = ({ draft }) => {
  const [settings, setSettings] = useState({});

  // hydrate when loaded
  useEffect(() => {
    if (draft) {
      const content = draft.content || {};
      const options = draft.options || {};

      setSettings({
        name: draft.name,
        id: draft.id,
        description: draft.description,
        subject: content.subject,
        reply_to: content.reply_to,
        from_name: content.from.name,
        from_email: content.from.email,
        open_tracking: options.open_tracking,
        click_tracking: options.click_tracking,
        transactional: options.transactional
      });
    }
  }, [draft]);

  return {
    settings
  };
};

export default useEditorContent;
